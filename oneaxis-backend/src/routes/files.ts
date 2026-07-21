import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();
router.use(authMiddleware);

// File upload config (local storage for dev, S3 for production)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.dwg', '.dxf', '.rvt', '.ifc', '.skp', '.stp', '.step', '.xlsx', '.xls', '.csv', '.jpg', '.jpeg', '.png'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${ext}`));
    }
  },
});

const fileTypeMap: Record<string, string> = {
  '.pdf': 'pdf', '.dwg': 'cad', '.dxf': 'cad', '.rvt': 'bim', '.ifc': 'bim',
  '.skp': 'bim', '.stp': 'cad', '.step': 'cad', '.xlsx': 'excel', '.xls': 'excel',
  '.csv': 'excel', '.jpg': 'image', '.jpeg': 'image', '.png': 'image',
};

// POST /api/files/upload - Upload file for a project
router.post('/upload', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { projectId } = req.body;
    if (!projectId) {
      res.status(400).json({ error: 'Project ID required' });
      return;
    }

    // Verify project ownership
    const project = await queryOne(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user!.id]
    );
    if (!project) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const ext = req.file.originalname.toLowerCase().slice(req.file.originalname.lastIndexOf('.'));
    const fileType = fileTypeMap[ext] || 'unknown';

    const fileRecord = await queryOne(
      `INSERT INTO files (project_id, name, type, size, url, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [projectId, req.file.originalname, fileType, req.file.size, `/uploads/${req.file.filename}`, 'uploaded']
    );

    logger.info(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);

    res.status(201).json({
      file: fileRecord,
      message: 'File uploaded successfully',
    });
  } catch (err: any) {
    logger.error('File upload error', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// GET /api/files/:projectId - List project files
router.get('/:projectId', async (req: AuthRequest, res) => {
  try {
    const files = await query(
      'SELECT * FROM files WHERE project_id = $1 ORDER BY created_at DESC',
      [req.params.projectId]
    );
    res.json({ files });
  } catch (err: any) {
    logger.error('List files error', err);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// DELETE /api/files/:fileId
router.delete('/:fileId', async (req: AuthRequest, res) => {
  try {
    await query('DELETE FROM files WHERE id = $1', [req.params.fileId]);
    res.json({ success: true });
  } catch (err: any) {
    logger.error('Delete file error', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
