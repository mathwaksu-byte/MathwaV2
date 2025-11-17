// Universities routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { requireAdmin } from '../utils/auth';

export function universitiesRoutes(router: Router) {
  // Get all universities (public)
  router.get('/api/universities', async (request: any) => {
    try {
      const url = new URL(request.url);
      const country = url.searchParams.get('country');
      const city = url.searchParams.get('city');
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      let query = supabase
        .from('universities')
        .select('*')
        .order('ranking', { ascending: true });

      if (country) {
        query = query.eq('country', country);
      }
      
      if (city) {
        query = query.eq('city', city);
      }

      const { data, error } = await query;

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ universities: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch universities' }, 500);
    }
  });

  // Get single university with programs and gallery (public)
  router.get('/api/universities/:id', async (request: any) => {
    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      const { data: university, error } = await supabase
        .from('universities')
        .select(`
          *,
          programs (*),
          gallery (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return jsonResponse({ error: 'University not found' }, 404);
      }

      return jsonResponse({ university });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch university' }, 500);
    }
  });

  // Create university (admin only)
  router.post('/api/universities', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const body = await request.json();
      const { name, country, city, description, ranking, tuitionFee, imageUrl } = body;

      if (!name || !country || !city) {
        return jsonResponse({ error: 'Name, country, and city are required' }, 400);
      }

      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('universities')
        .insert({
          name,
          country,
          city,
          description,
          ranking,
          tuitionFee,
          imageUrl
        })
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ university: data }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to create university' }, 500);
    }
  });

  // Update university (admin only)
  router.put('/api/universities/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const body = await request.json();
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('universities')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ university: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to update university' }, 500);
    }
  });

  // Delete university (admin only)
  router.delete('/api/universities/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: 'University deleted successfully' });
    } catch (error) {
      return jsonResponse({ error: 'Failed to delete university' }, 500);
    }
  });
}
