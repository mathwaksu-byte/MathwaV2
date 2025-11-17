// Programs routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { requireAdmin } from '../utils/auth';

export function programsRoutes(router: Router) {
  // Get all programs (public)
  router.get('/api/programs', async (request: any) => {
    try {
      const url = new URL(request.url);
      const universityId = url.searchParams.get('universityId');
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      let query = supabase
        .from('programs')
        .select('*, university:universities(*)');

      if (universityId) {
        query = query.eq('universityId', universityId);
      }

      const { data, error } = await query;

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ programs: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch programs' }, 500);
    }
  });

  // Get single program (public)
  router.get('/api/programs/:id', async (request: any) => {
    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase
        .from('programs')
        .select('*, university:universities(*)')
        .eq('id', id)
        .single();

      if (error) {
        return jsonResponse({ error: 'Program not found' }, 404);
      }

      return jsonResponse({ program: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch program' }, 500);
    }
  });

  // Create program (admin only)
  router.post('/api/programs', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const body = await request.json();
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('programs')
        .insert(body)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ program: data }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to create program' }, 500);
    }
  });

  // Update program (admin only)
  router.put('/api/programs/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const body = await request.json();
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('programs')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ program: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to update program' }, 500);
    }
  });

  // Delete program (admin only)
  router.delete('/api/programs/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: 'Program deleted successfully' });
    } catch (error) {
      return jsonResponse({ error: 'Failed to delete program' }, 500);
    }
  });
}
