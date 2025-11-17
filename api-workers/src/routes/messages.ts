// Messages / Contact form routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { requireAdmin } from '../utils/auth';

export function messagesRoutes(router: Router) {
  // Get all messages (admin only)
  router.get('/api/messages', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const url = new URL(request.url);
      const isRead = url.searchParams.get('isRead');
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      let query = supabase
        .from('messages')
        .select('*')
        .order('createdAt', { ascending: false });

      if (isRead !== null) {
        query = query.eq('isRead', isRead === 'true');
      }

      const { data, error } = await query;

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ messages: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch messages' }, 500);
    }
  });

  // Create message (public - contact form submission)
  router.post('/api/messages', async (request: any) => {
    try {
      const body = await request.json();
      const { name, email, phone, message } = body;

      if (!name || !email || !message) {
        return jsonResponse({ error: 'Name, email, and message are required' }, 400);
      }

      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({ name, email, phone, message })
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: 'Message sent successfully', data }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to send message' }, 500);
    }
  });

  // Mark message as read (admin only)
  router.patch('/api/messages/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const body = await request.json();
      const { isRead } = body;
      
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('messages')
        .update({ isRead })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: data });
    } catch (error) {
      return jsonResponse({ error: 'Failed to update message' }, 500);
    }
  });

  // Delete message (admin only)
  router.delete('/api/messages/:id', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { id } = request.params;
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ message: 'Message deleted successfully' });
    } catch (error) {
      return jsonResponse({ error: 'Failed to delete message' }, 500);
    }
  });
}
