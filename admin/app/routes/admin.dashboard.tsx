import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuth } from "../lib/auth.server";
import { adminApi } from "../lib/api.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { token } = await requireAuth(request);

  try {
    const [universitiesData, applicationsData, messagesData] = await Promise.all([
      adminApi.universities.getAll(token),
      adminApi.applications.getAll(token),
      adminApi.messages.getAll(token),
    ]);

    return json({
      stats: {
        universities: universitiesData.universities?.length || 0,
        applications: applicationsData.applications?.length || 0,
        pendingApplications:
          applicationsData.applications?.filter((a: any) => a.status === "PENDING").length || 0,
        unreadMessages: messagesData.messages?.filter((m: any) => !m.isRead).length || 0,
      },
      recentApplications: applicationsData.applications?.slice(0, 5) || [],
    });
  } catch (error) {
    return json({
      stats: { universities: 0, applications: 0, pendingApplications: 0, unreadMessages: 0 },
      recentApplications: [],
    });
  }
}

export default function AdminDashboard() {
  const { stats, recentApplications } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Universities</p>
              <p className="text-3xl font-bold">{stats.universities}</p>
            </div>
            <span className="text-4xl">🏫</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Applications</p>
              <p className="text-3xl font-bold">{stats.applications}</p>
            </div>
            <span className="text-4xl">📝</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold">{stats.pendingApplications}</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unread Messages</p>
              <p className="text-3xl font-bold">{stats.unreadMessages}</p>
            </div>
            <span className="text-4xl">💬</span>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Applications</h2>
          <Link to="/admin/applications" className="text-primary-600 hover:underline">
            View All
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <p className="text-gray-600">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((app: any) => (
              <div key={app.id} className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{app.user?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-600">{app.university?.name}</p>
                    <p className="text-sm text-gray-600">{app.program?.name}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      app.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
