// Applications routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { requireAuth, requireAdmin } from '../utils/auth';

export function applicationsRoutes(router: Router) {
  // Get all applications (admin only)
  router.get('/api/applications', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const url = new URL(request.url);
      const status = url.searchParams.get('status');
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      let query = supabase
        .from('applications')
        .select(`
          *,
          user:users(name, email, phone),
          program:programs(name),
          university:universities(name)
        `)
        .order('createdAt', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ applications: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch applications' }, 500);
    }
  });

  // Get single application (authenticated users)
  router.get('/api/applications/:id', async (request: any) => {
    const authResult = await requireAuth(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const user = authResult;
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      let query = supabase
        .from('applications')
        .select(`
          *,
          user:users(name, email, phone),
          program:programs(name, duration, fee),
          university:universities(name, country, city)
        `)
        .eq('id', id);

      // Non-admin users can only see their own applications
      if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
        query = query.eq('userId', user.id);
      }

      const { data, error } = await query.single();

      if (error) {
        return jsonResponse({ error: 'Application not found' }, 404);
      }

      return jsonResponse({ application: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch application' }, 500);
    }
  });

  // Create application (authenticated users)
  router.post('/api/applications', async (request: any) => {
    const authResult = await requireAuth(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const body = await request.json();
      const user = authResult;
      
      const { programId, universityId, documents } = body;

      if (!programId || !universityId) {
        return jsonResponse({ error: 'Program ID and University ID are required' }, 400);
      }

      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          userId: user.id,
          programId,
          universityId,
          documents,
          status: 'PENDING'
        })
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ application: data }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to create application' }, 500);
    }
  });

  // Update application status (admin only)
  router.patch('/api/applications/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const body = await request.json();
      const { status, notes } = body;
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const updateData: any = {};
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;

      const { data, error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ application: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to update application' }, 500);
    }
  });

  // Delete application (admin only)
  router.delete('/api/applications/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: 'Application deleted successfully' });
    } catch (error) {
      return jsonResponse({ error: 'Failed to delete application' }, 500);
    }
  });

  // Get user's own applications
  router.get('/api/applications/user/me', async (request: any) => {
    const authResult = await requireAuth(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const user = authResult;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          program:programs(name, duration, fee),
          university:universities(name, country, city)
        `)
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ applications: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch applications' }, 500);
    }
  });
}
