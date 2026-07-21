import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/proposals/view/:slug - Public proposal view
router.get('/view/:slug', async (req, res) => {
  try {
    const proposal = await queryOne(
      `SELECT p.*, pr.name as project_name, pr.type as project_type, pr.metadata
       FROM proposals p
       JOIN projects pr ON pr.id = p.project_id
       WHERE p.url_slug = $1 AND p.is_active = true
       AND (p.expiry_date IS NULL OR p.expiry_date > NOW())`,
      [req.params.slug]
    );

    if (!proposal) {
      res.status(404).json({ error: 'Proposal not found or expired' });
      return;
    }

    // Increment view count
    await query(
      'UPDATE proposals SET view_count = view_count + 1 WHERE id = $1',
      [proposal.id]
    );

    const units = await query(
      'SELECT * FROM units WHERE project_id = $1 ORDER BY floor, unit_number',
      [proposal.project_id]
    );

    res.json({
      proposal: {
        ...proposal,
        config: proposal.config,
      },
      units,
    });
  } catch (err: any) {
    logger.error('Proposal view error', err);
    res.status(500).json({ error: 'Failed to load proposal' });
  }
});

// POST /api/proposals (protected)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { projectId, config, accessType, password, expiryDays } = req.body;
    const slug = uuidv4().slice(0, 12);
    const expiryDate = expiryDays
      ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
      : null;

    const proposal = await queryOne(
      `INSERT INTO proposals (project_id, user_id, config, url_slug, access_type, password, expiry_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [projectId, req.user!.id, JSON.stringify(config), slug, accessType || 'anyone', password || null, expiryDate]
    );

    res.status(201).json({
      proposal,
      url: `${process.env.FRONTEND_URL}/proposals/${slug}`,
    });
  } catch (err: any) {
    logger.error('Proposal create error', err);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// GET /api/proposals/:projectId/stats
router.get('/:projectId/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const stats = await queryOne(
      `SELECT 
        COUNT(*) as total_proposals,
        SUM(view_count) as total_views,
        AVG(view_count) as avg_views
       FROM proposals WHERE project_id = $1`,
      [req.params.projectId]
    );
    res.json({ stats });
  } catch (err: any) {
    logger.error('Proposal stats error', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
