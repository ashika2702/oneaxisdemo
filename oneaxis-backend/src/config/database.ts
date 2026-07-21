import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'oneaxis',
  user: process.env.DB_USER || 'oneaxis_user',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', err);
});

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  logger.debug(`Query: ${text.slice(0, 50)}... (${duration}ms, ${result.rowCount} rows)`);
  return result.rows;
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function initDatabase(): Promise<void> {
  logger.info('Initializing database...');

  // Users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      company VARCHAR(255),
      avatar_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'uploading',
      stage VARCHAR(50) DEFAULT 'sales',
      location_lat DECIMAL(10, 8),
      location_lng DECIMAL(11, 8),
      location_address TEXT,
      thumbnail_url VARCHAR(500),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Units table
  await query(`
    CREATE TABLE IF NOT EXISTS units (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      unit_number VARCHAR(50) NOT NULL,
      floor INTEGER NOT NULL,
      type VARCHAR(100),
      area DECIMAL(10, 2),
      bedrooms INTEGER DEFAULT 0,
      bathrooms INTEGER DEFAULT 0,
      price DECIMAL(15, 2),
      base_price DECIMAL(15, 2),
      status VARCHAR(50) DEFAULT 'available',
      view_type VARCHAR(100),
      facing VARCHAR(50),
      materials JSONB DEFAULT '{}',
      customization_price DECIMAL(15, 2) DEFAULT 0,
      position JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Files table
  await query(`
    CREATE TABLE IF NOT EXISTS files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      size BIGINT,
      url VARCHAR(500),
      s3_key VARCHAR(500),
      status VARCHAR(50) DEFAULT 'uploaded',
      ai_result JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Edit history table
  await query(`
    CREATE TABLE IF NOT EXISTS edit_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id),
      user_name VARCHAR(255),
      action VARCHAR(100) NOT NULL,
      element VARCHAR(255),
      before_value TEXT,
      after_value TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Proposals table
  await query(`
    CREATE TABLE IF NOT EXISTS proposals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id),
      config JSONB NOT NULL DEFAULT '{}',
      url_slug VARCHAR(255) UNIQUE NOT NULL,
      access_type VARCHAR(50) DEFAULT 'anyone',
      password VARCHAR(255),
      expiry_date TIMESTAMP,
      view_count INTEGER DEFAULT 0,
      unique_view_count INTEGER DEFAULT 0,
      avg_time_seconds INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Widget configs table
  await query(`
    CREATE TABLE IF NOT EXISTS widget_configs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      config JSONB NOT NULL DEFAULT '{}',
      embed_code TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // BOM items table
  await query(`
    CREATE TABLE IF NOT EXISTS bom_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      quantity DECIMAL(10, 2),
      unit VARCHAR(50),
      cost_per_unit DECIMAL(15, 2),
      total_cost DECIMAL(15, 2),
      supplier VARCHAR(255),
      lead_time VARCHAR(100),
      status VARCHAR(50) DEFAULT 'pending',
      linked_element VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  logger.info('Database initialized successfully');
}

export { pool };
