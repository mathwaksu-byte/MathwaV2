// Gallery routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { requireAdmin } from '../utils/auth';

export function galleryRoutes(router: Router) {
  // Get all gallery images (public)
  router.get('/api/gallery', async (request: any) => {
    try {
      const url = new URL(request.url);
      const universityId = url.searchParams.get('universityId');
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      let query = supabase
        .from('gallery')
        .select('*, university:universities(name)')
        .order('createdAt', { ascending: false });

      if (universityId) {
        query = query.eq('universityId', universityId);
      }

      const { data, error } = await query;

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ gallery: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch gallery' }, 500);
    }
  });

  // Create gallery image (admin only)
  router.post('/api/gallery', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const body = await request.json();
      const { imageUrl, title, universityId } = body;

      if (!imageUrl) {
        return jsonResponse({ error: 'Image URL is required' }, 400);
      }

      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('gallery')
        .insert({ imageUrl, title, universityId })
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ image: data }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to create gallery image' }, 500);
    }
  });

  // Delete gallery image (admin only)
  router.delete('/api/gallery/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: 'Gallery image deleted successfully' });
    } catch (error) {
      return jsonResponse({ error: 'Failed to delete gallery image' }, 500);
    }
  });
}
