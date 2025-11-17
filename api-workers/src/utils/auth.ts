// Authentication utilities using Supabase Auth

import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from './cors';

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'STUDENT';
}

export async function verifyToken(request: Request, env: any): Promise<AuthUser | null> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    // Fetch user role from database
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (dbError || !userData) {
      return {
        id: user.id,
        email: user.email || '',
        role: 'STUDENT' // Default role
      };
    }

    return {
      id: user.id,
      email: user.email || '',
      role: userData.role
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function requireAuth(request: Request, env: any): Promise<AuthUser | Response> {
  const user = await verifyToken(request, env);
  
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  
  return user;
}

export async function requireAdmin(request: Request, env: any): Promise<AuthUser | Response> {
  const user = await verifyToken(request, env);
  
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  
  if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
    return jsonResponse({ error: 'Forbidden - Admin access required' }, 403);
  }
  
  return user;
}
