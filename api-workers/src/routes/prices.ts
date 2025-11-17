// Prices routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { requireAdmin } from '../utils/auth';

export function pricesRoutes(router: Router) {
  // Get price settings (public)
  router.get('/api/prices', async (request: any) => {
    try {
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase
        .from('price_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ prices: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch prices' }, 500);
    }
  });

  // Update price settings (admin only)
  router.put('/api/prices/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const body = await request.json();
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('price_settings')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ prices: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to update prices' }, 500);
    }
  });

  // Create initial price settings (admin only)
  router.post('/api/prices', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const body = await request.json();
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('price_settings')
        .insert(body)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ prices: data }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to create prices' }, 500);
    }
  });
}
