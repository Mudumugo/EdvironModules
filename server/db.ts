import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized connection pool configuration
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Performance optimizations
  max: 10, // Reduced from default to prevent connection overload
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 2000, // 2 seconds
});

export const db = drizzle({ 
  client: pool, 
  schema,
  logger: false, // Disable logging for performance
});