// Authentication routes

import { Router } from 'itty-router';
import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../utils/cors';
import { verifyToken } from '../utils/auth';

export function authRoutes(router: Router) {
  // Login
  router.post('/api/auth/login', async (request: any) => {
    try {
      const { email, password } = await request.json();
      
      if (!email || !password) {
        return jsonResponse({ error: 'Email and password required' }, 400);
      }

      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return jsonResponse({ error: error.message }, 401);
      }

      return jsonResponse({
        user: data.user,
        session: data.session,
        token: data.session?.access_token
      });
    } catch (error) {
      return jsonResponse({ error: 'Login failed' }, 500);
    }
  });

  // Verify token
  router.get('/api/auth/verify', async (request: any) => {
    const user = await verifyToken(request, request.env);
    
    if (!user) {
      return jsonResponse({ error: 'Invalid token' }, 401);
    }

    return jsonResponse({ user });
  });

  // Logout (client-side token removal mainly, but can revoke here)
  router.post('/api/auth/logout', async (request: any) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_ANON_KEY);
      
      await supabase.auth.signOut();
    }

    return jsonResponse({ message: 'Logged out successfully' });
  });

  // Register new user (can be restricted to admin only if needed)
  router.post('/api/auth/register', async (request: any) => {
    try {
      const { email, password, name, phone, role = 'STUDENT' } = await request.json();
      
      if (!email || !password || !name) {
        return jsonResponse({ error: 'Email, password, and name required' }, 400);
      }

      const supabase = createClient(request.env.SUPABASE_URL, request.env.SUPABASE_SERVICE_KEY);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) {
        return jsonResponse({ error: authError.message }, 400);
      }

      // Create user record in database
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          phone,
          role
        })
        .select()
        .single();

      if (dbError) {
        return jsonResponse({ error: dbError.message }, 500);
      }

      return jsonResponse({ user: userData }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Registration failed' }, 500);
    }
  });
}
