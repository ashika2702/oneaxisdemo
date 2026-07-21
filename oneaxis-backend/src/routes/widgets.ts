import { Router } from 'express';
import { query, queryOne } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/widgets/embed/:projectId - Public embed endpoint (no auth)
router.get('/embed/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const config = await queryOne(
      'SELECT * FROM widget_configs WHERE project_id = $1 AND is_active = true',
      [projectId]
    );

    if (!config) {
      res.status(404).json({ error: 'Widget not found' });
      return;
    }

    const project = await queryOne(
      'SELECT id, name, type FROM projects WHERE id = $1',
      [projectId]
    );

    const units = await query(
      'SELECT id, unit_number, floor, type, area, bedrooms, bathrooms, price, status, view_type, facing FROM units WHERE project_id = $1 ORDER BY floor, unit_number',
      [projectId]
    );

    res.json({
      project,
      units,
      config: config.config,
    });
  } catch (err: any) {
    logger.error('Widget embed error', err);
    res.status(500).json({ error: 'Failed to load widget' });
  }
});

// POST /api/widgets (protected)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { projectId, config } = req.body;
    const widget = await queryOne(
      `INSERT INTO widget_configs (project_id, config, embed_code)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id) DO UPDATE
       SET config = $2, embed_code = $3
       RETURNING *`,
      [projectId, JSON.stringify(config), generateEmbedCode(projectId, config)]
    );
    res.status(201).json({ widget });
  } catch (err: any) {
    logger.error('Widget save error', err);
    res.status(500).json({ error: 'Failed to save widget' });
  }
});

function generateEmbedCode(projectId: string, config: any): string {
  return `<!-- OneAxis Widget -->
<div id="oa-widget" data-project="${projectId}"></div>
<script src="https://cdn.oneaxis.io/widget.js" data-config='${JSON.stringify(config)}' async></script>`;
}

export default router;
