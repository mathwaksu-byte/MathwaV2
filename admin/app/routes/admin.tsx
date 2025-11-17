import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, Form } from "@remix-run/react";
import { requireAuth } from "../lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireAuth(request);
  return json({ user });
}

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-primary-600">
            MATHWA Admin
          </Link>
          <p className="text-sm text-gray-600 mt-1">{user.email}</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/universities"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                🏫 Universities
              </Link>
            </li>
            <li>
              <Link
                to="/admin/applications"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                📝 Applications
              </Link>
            </li>
            <li>
              <Link
                to="/admin/messages"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                💬 Messages
              </Link>
            </li>
            <li>
              <Link
                to="/admin/gallery"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                🖼️ Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/admin/content"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                📄 Content
              </Link>
            </li>
            <li>
              <Link
                to="/admin/prices"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                💰 Prices
              </Link>
            </li>
          </ul>

          <div className="mt-8 pt-8 border-t">
            <Form action="/admin/logout" method="post">
              <button
                type="submit"
                className="w-full px-4 py-2 text-left rounded-lg hover:bg-red-50 text-red-600 transition"
              >
                🚪 Logout
              </button>
            </Form>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
