// Cloudflare Workers API - MATHWA
// Main entry point with router

import { Router } from 'itty-router';
import { corsHeaders, handleCORS } from './utils/cors';
import { authRoutes } from './routes/auth';
import { universitiesRoutes } from './routes/universities';
import { programsRoutes } from './routes/programs';
import { galleryRoutes } from './routes/gallery';
import { pricesRoutes } from './routes/prices';
import { contentRoutes } from './routes/content';
import { applicationsRoutes } from './routes/applications';
import { messagesRoutes } from './routes/messages';
import { uploadRoutes } from './routes/upload';

const router = Router();

// Health check
router.get('/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
});

// Mount route modules
authRoutes(router);
universitiesRoutes(router);
programsRoutes(router);
galleryRoutes(router);
pricesRoutes(router);
contentRoutes(router);
applicationsRoutes(router);
messagesRoutes(router);
uploadRoutes(router);

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
});

// Main worker fetch handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    try {
      // Attach env to request for route handlers
      (request as any).env = env;
      
      return await router.handle(request);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

export interface Env {
  DATABASE_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  JWT_SECRET: string;
}
