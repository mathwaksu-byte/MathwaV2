import type { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ context }: LoaderFunctionArgs) {
  const base = ((context as any)?.env?.PUBLIC_APP_BASE_URL as string) || ((import.meta as any)?.env?.PUBLIC_APP_BASE_URL as string) || 'http://localhost:5173';
  const body = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}

export default function Robots() { return null; }
