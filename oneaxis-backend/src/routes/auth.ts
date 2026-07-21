import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query, queryOne } from '../config/database';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  company: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await queryOne('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await queryOne(
      `INSERT INTO users (email, password_hash, name, company)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, company, created_at`,
      [data.email, passwordHash, data.name, data.company || null]
    );

    const token = generateToken(user!.id, user!.email, user!.role);
    res.status(201).json({
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        role: user!.role,
        company: user!.company,
      },
      token,
    });
  } catch (err: any) {
    logger.error('Registration error', err);
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await queryOne(
      'SELECT id, email, name, role, company, password_hash FROM users WHERE email = $1',
      [data.email]
    );

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id, user.email, user.role);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
      },
      token,
    });
  } catch (err: any) {
    logger.error('Login error', err);
    res.status(400).json({ error: err.message || 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;
