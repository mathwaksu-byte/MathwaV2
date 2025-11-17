import type { MetaFunction } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import styles from './tailwind.css?url';
import SmartPopup from './components/SmartPopup';
import FloatingActions from './components/FloatingActions';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useEffect } from 'react';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
];

export const meta: MetaFunction = () => ([
  { title: 'Kyrgyz State University — MATHWA Official Admissions' },
  { name: 'description', content: 'Official admissions representation for Kyrgyz State University (Arabaev KSU) via MATHWA.' },
]);

export default function App() {
  // Apply admin-configured background gradient and enforce Emerald Teal site-wide.
  useEffect(() => {
    // Remove any previous local overrides to ensure consistent brand background
    try { if (typeof window !== 'undefined') window.localStorage.removeItem('app-bg'); } catch (e) { void e }
    const envBase = (import.meta as any).env?.PUBLIC_SERVER_BASE_URL as string | undefined;
    const bases = [
      ...(envBase ? [envBase] : []),
      'http://localhost:3001',
      'http://localhost:4000',
      'http://localhost:4001'
    ];
    const apply = (css?: string) => {
      if (css && css.trim().length > 0) {
        document.documentElement.style.setProperty('--app-bg', css);
      }
    };
    (async () => {
      let settings: any = null;
      for (const b of bases) {
        const r = await fetch(`${b}/api/settings/public`).catch(() => null as any);
        if (r && r.ok) { settings = await r.json(); break; }
      }
      apply(settings?.settings?.background_gradient_css);
    })().catch((e) => { void e });
  }, []);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <SmartPopup />
        <FloatingActions />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
