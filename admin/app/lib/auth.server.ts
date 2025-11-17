import { createClient } from "@supabase/supabase-js";
import { redirect } from "@remix-run/node";

const API_URL = process.env.API_URL || "http://localhost:8787";

export async function requireAuth(request: Request) {
  const token = await getAuthToken(request);
  
  if (!token) {
    throw redirect("/admin/login");
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw redirect("/admin/login");
    }

    const { user } = await response.json();
    
    if (user.role !== "ADMIN" && user.role !== "EDITOR") {
      throw new Response("Forbidden", { status: 403 });
    }

    return { user, token };
  } catch (error) {
    throw redirect("/admin/login");
  }
}

export async function getAuthToken(request: Request): Promise<string | null> {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  
  const matches = cookie.match(/auth_token=([^;]+)/);
  return matches ? matches[1] : null;
}

export function createAuthCookie(token: string) {
  return `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`; // 7 days
}

export function deleteAuthCookie() {
  return `auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
