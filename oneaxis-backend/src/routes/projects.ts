import { Router } from 'express';
import { z } from 'zod';
import { query, queryOne, transaction } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();
router.use(authMiddleware);

const createProjectSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['real-estate', 'construction', 'manufacturing', 'industrial', 'oil-gas']),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  location_address: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.string().optional(),
  stage: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  location_address: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// GET /api/projects - List user's projects
router.get('/', async (req: AuthRequest, res) => {
  try {
    const projects = await query(
      `SELECT p.*, 
        (SELECT COUNT(*) FROM units WHERE project_id = p.id) as unit_count,
        (SELECT COUNT(*) FROM units WHERE project_id = p.id AND status = 'available') as available_count,
        (SELECT COUNT(*) FROM files WHERE project_id = p.id) as file_count
       FROM projects p WHERE p.user_id = $1
       ORDER BY p.updated_at DESC`,
      [req.user!.id]
    );
    res.json({ projects });
  } catch (err: any) {
    logger.error('List projects error', err);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// POST /api/projects - Create project
router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createProjectSchema.parse(req.body);
    const project = await queryOne(
      `INSERT INTO projects (user_id, name, type, location_lat, location_lng, location_address, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user!.id, data.name, data.type, data.location_lat || null, data.location_lng || null, data.location_address || null, JSON.stringify(data.metadata || {})]
    );
    res.status(201).json({ project });
  } catch (err: any) {
    logger.error('Create project error', err);
    res.status(400).json({ error: err.message || 'Failed to create project' });
  }
});

// GET /api/projects/:id - Get project with units, files, BOM
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const project = await queryOne(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    );
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const units = await query('SELECT * FROM units WHERE project_id = $1 ORDER BY floor, unit_number', [req.params.id]);
    const files = await query('SELECT * FROM files WHERE project_id = $1 ORDER BY created_at DESC', [req.params.id]);
    const bom = await query('SELECT * FROM bom_items WHERE project_id = $1 ORDER BY category, name', [req.params.id]);
    const edits = await query(
      `SELECT * FROM edit_history WHERE project_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.id]
    );

    res.json({ project, units, files, bom, edits });
  } catch (err: any) {
    logger.error('Get project error', err);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = updateProjectSchema.parse(req.body);
    const updates: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (data.name) { updates.push(`name = $${i++}`); values.push(data.name); }
    if (data.status) { updates.push(`status = $${i++}`); values.push(data.status); }
    if (data.stage) { updates.push(`stage = $${i++}`); values.push(data.stage); }
    if (data.location_lat !== undefined) { updates.push(`location_lat = $${i++}`); values.push(data.location_lat); }
    if (data.location_lng !== undefined) { updates.push(`location_lng = $${i++}`); values.push(data.location_lng); }
    if (data.location_address) { updates.push(`location_address = $${i++}`); values.push(data.location_address); }
    if (data.metadata) { updates.push(`metadata = $${i++}`); values.push(JSON.stringify(data.metadata)); }
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(req.params.id, req.user!.id);

    const project = await queryOne(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${i} AND user_id = $${i + 1} RETURNING *`,
      values
    );

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ project });
  } catch (err: any) {
    logger.error('Update project error', err);
    res.status(400).json({ error: err.message || 'Failed to update project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user!.id]
    );
    if (result.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    logger.error('Delete project error', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST /api/projects/:id/units - Add unit
router.post('/:id/units', async (req: AuthRequest, res) => {
  try {
    const unit = await queryOne(
      `INSERT INTO units (project_id, unit_number, floor, type, area, bedrooms, bathrooms, price, base_price, status, view_type, facing, materials)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [req.params.id, req.body.unit_number, req.body.floor, req.body.type, req.body.area,
       req.body.bedrooms, req.body.bathrooms, req.body.price, req.body.base_price,
       req.body.status || 'available', req.body.view_type, req.body.facing, JSON.stringify(req.body.materials || {})]
    );

    // Log edit
    await query(
      `INSERT INTO edit_history (project_id, user_id, user_name, action, element, after_value)
       VALUES ($1, $2, $3, 'Added', $4, $5)`,
      [req.params.id, req.user!.id, req.user!.name, `Unit ${req.body.unit_number}`, JSON.stringify(req.body)]
    );

    res.status(201).json({ unit });
  } catch (err: any) {
    logger.error('Add unit error', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/projects/:id/units/:unitId - Update unit
router.put('/:id/units/:unitId', async (req: AuthRequest, res) => {
  try {
    const before = await queryOne('SELECT * FROM units WHERE id = $1 AND project_id = $2', [req.params.unitId, req.params.id]);
    const unit = await queryOne(
      `UPDATE units SET 
        status = COALESCE($1, status),
        price = COALESCE($2, price),
        materials = COALESCE($3, materials),
        customization_price = COALESCE($4, customization_price)
       WHERE id = $5 AND project_id = $6
       RETURNING *`,
      [req.body.status, req.body.price, req.body.materials ? JSON.stringify(req.body.materials) : null,
       req.body.customization_price, req.params.unitId, req.params.id]
    );

    await query(
      `INSERT INTO edit_history (project_id, user_id, user_name, action, element, before_value, after_value)
       VALUES ($1, $2, $3, 'Modified', $4, $5, $6)`,
      [req.params.id, req.user!.id, req.user!.name, `Unit ${before?.unit_number}`, JSON.stringify(before), JSON.stringify(unit)]
    );

    res.json({ unit });
  } catch (err: any) {
    logger.error('Update unit error', err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
