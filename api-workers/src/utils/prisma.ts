// Prisma client for Cloudflare Workers
// Uses connection pooling with pg adapter for Supabase

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(databaseUrl: string): PrismaClient {
  // Reuse existing instance if available
  if (prismaInstance) {
    return prismaInstance;
  }

  // Create connection pool
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1, // Cloudflare Workers limitation
  });

  // Create Prisma adapter
  const adapter = new PrismaPg(pool);

  // Create Prisma client with adapter
  prismaInstance = new PrismaClient({ adapter });

  return prismaInstance;
}

// Alternative: Direct Supabase connection without adapter
// Use this if connection pooling causes issues
export function getPrismaClientDirect(databaseUrl: string): PrismaClient {
  if (prismaInstance) {
    return prismaInstance;
  }

  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  return prismaInstance;
}
