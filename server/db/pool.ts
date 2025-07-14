import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Optimize connection pool for better performance
  max: 20, // Maximum number of clients in the pool
  min: 5,  // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
  statement_timeout: 30000, // Cancel queries after 30 seconds
  query_timeout: 30000, // Return an error after 30 seconds if query is still running
  
  // Keep connections alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false 
  } : false,
};

// Create optimized connection pool
export const optimizedPool = new Pool(poolConfig);

// Connection pool event handlers for monitoring
optimizedPool.on('connect', (client) => {
  console.log(`[DB] New client connected (total: ${optimizedPool.totalCount})`);
});

optimizedPool.on('remove', (client) => {
  console.log(`[DB] Client removed (total: ${optimizedPool.totalCount})`);
});

optimizedPool.on('error', (err, client) => {
  console.error('[DB] Unexpected error on idle client', err);
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('[DB] Gracefully closing database pool...');
  await optimizedPool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[DB] Gracefully closing database pool...');
  await optimizedPool.end();
  process.exit(0);
});

// Health check function
export const checkPoolHealth = () => {
  return {
    totalCount: optimizedPool.totalCount,
    idleCount: optimizedPool.idleCount,
    waitingCount: optimizedPool.waitingCount,
    isHealthy: optimizedPool.totalCount > 0
  };
};

// Query execution with automatic retry and connection recovery
export const executeQuery = async (text: string, params?: any[]) => {
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const start = Date.now();
      const result = await optimizedPool.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`[DB] Slow query detected: ${duration}ms - ${text.substring(0, 100)}...`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`[DB] Query attempt ${attempt} failed:`, error);
      
      // Don't retry on syntax errors or constraint violations
      if (error.code === '42601' || error.code === '23505') {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError;
};