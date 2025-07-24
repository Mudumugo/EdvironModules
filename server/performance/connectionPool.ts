// Note: This file provides PostgreSQL connection pooling utilities
// Currently using Neon serverless, but keeping for future reference

// Optimized connection pool for PostgreSQL
let pool: Pool | null = null;

export function createConnectionPool() {
  if (pool) return pool;

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optimized connection pool settings
    max: 20, // Maximum number of connections
    min: 2, // Minimum number of connections
    idle: 10000, // Close connections after 10 seconds of inactivity
    acquire: 30000, // Maximum time to wait for connection (30s)
    evict: 60000, // How long a connection can be idle before being evicted (1 min)
    
    // Performance optimizations
    connectionTimeoutMillis: 2000, // Connection timeout (2s)
    idleTimeoutMillis: 10000, // Idle timeout (10s)
    query_timeout: 5000, // Query timeout (5s)
    
    // Connection validation
    allowExitOnIdle: true,
  });

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Database pool error:', err);
  });

  pool.on('connect', () => {
    console.log('[DB] Connection established');
  });

  pool.on('acquire', () => {
    console.log('[DB] Connection acquired from pool');
  });

  pool.on('release', () => {
    console.log('[DB] Connection released back to pool');
  });

  return pool;
}

export function getPool(): Pool {
  if (!pool) {
    pool = createConnectionPool();
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}