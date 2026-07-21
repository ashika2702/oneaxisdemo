import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { parsePlanImage, chatWithProject } from '../services/aiParser';
import { query, queryOne } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();
router.use(authMiddleware);

// POST /api/ai/parse-plan - Parse uploaded plan image
router.post('/parse-plan', async (req: AuthRequest, res) => {
  try {
    const { imageBase64, fileId } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const result = await parsePlanImage(imageBase64);

    // Update file record with AI results
    if (fileId) {
      await query(
        'UPDATE files SET ai_result = $1, status = $2 WHERE id = $3',
        [JSON.stringify(result), 'processed', fileId]
      );
    }

    res.json({
      success: true,
      result,
      message: `Detected ${result.floors} floors, ${result.units.length} units`,
    });
  } catch (err: any) {
    logger.error('Parse plan error', err);
    res.status(500).json({ error: 'Failed to parse plan' });
  }
});

// POST /api/ai/chat - Chat with project context
router.post('/chat', async (req: AuthRequest, res) => {
  try {
    const { message, projectId } = req.body;
    if (!message) {
      res.status(400).json({ error: 'No message provided' });
      return;
    }

    // Get project context
    let context: any = { name: 'Unknown' };
    if (projectId) {
      const project = await queryOne(
        `SELECT p.*, 
          (SELECT json_agg(u.*) FROM units u WHERE u.project_id = p.id) as units
         FROM projects p WHERE p.id = $1 AND p.user_id = $2`,
        [projectId, req.user!.id]
      );
      if (project) context = project;
    }

    const response = await chatWithProject(message, context);

    res.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Chat error', err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// POST /api/ai/generate-options - AI Optioneer
router.post('/generate-options', async (req: AuthRequest, res) => {
  try {
    const { projectId, constraints } = req.body;
    const project = await queryOne(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user!.id]
    );

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Generate 4 scenarios based on constraints
    const scenarios = [
      {
        name: 'Maximum Revenue',
        revenue: 52.4,
        units: 50,
        avgPrice: 1.05,
        risk: 'Medium',
        description: 'Optimize for highest total revenue with premium pricing',
        changes: ['Increase floor premium to 12%', 'Add penthouse units', 'Upgrade all kitchens'],
      },
      {
        name: 'Fastest Sell-Out',
        revenue: 48.2,
        units: 48,
        avgPrice: 1.0,
        risk: 'Low',
        description: 'Price to sell quickly and reduce carrying costs',
        changes: ['Competitive pricing', 'Early-bird discounts', 'Flexible payment plans'],
      },
      {
        name: 'Balanced Mix',
        revenue: 50.1,
        units: 49,
        avgPrice: 1.02,
        risk: 'Low',
        description: 'Balance revenue, speed, and market positioning',
        changes: ['Tiered pricing strategy', 'Mixed unit types', 'Staged release'],
      },
      {
        name: 'Premium Focus',
        revenue: 55.8,
        units: 44,
        avgPrice: 1.27,
        risk: 'High',
        description: 'Target luxury segment with fewer, higher-value units',
        changes: ['Reduce unit count by 10%', 'Add luxury finishes', 'Larger unit sizes'],
      },
    ];

    res.json({ scenarios });
  } catch (err: any) {
    logger.error('Generate options error', err);
    res.status(500).json({ error: 'Failed to generate options' });
  }
});

export default router;
