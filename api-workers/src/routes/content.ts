// Content blocks routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { requireAdmin } from '../utils/auth';

export function contentRoutes(router: Router) {
  // Get all content blocks (public)
  router.get('/api/content', async (request: any) => {
    try {
      const url = new URL(request.url);
      const key = url.searchParams.get('key');
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      let query = supabase.from('content_blocks').select('*');

      if (key) {
        query = query.eq('key', key).single();
        const { data, error } = await query;
        
        if (error) {
          return jsonResponse({ error: 'Content block not found' }, 404);
        }
        
        return jsonResponse({ content: data });
      }

      const { data, error } = await query;

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ content: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch content' }, 500);
    }
  });

  // Create content block (admin only)
  router.post('/api/content', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const body = await request.json();
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('content_blocks')
        .insert(body)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ content: data }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to create content block' }, 500);
    }
  });

  // Update content block (admin only)
  router.put('/api/content/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const body = await request.json();
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('content_blocks')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ content: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to update content block' }, 500);
    }
  });

  // Delete content block (admin only)
  router.delete('/api/content/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', id);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: 'Content block deleted successfully' });
    } catch (error) {
      return jsonResponse({ error: 'Failed to delete content block' }, 500);
    }
  });
}
