import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { requireAuth } from "../lib/auth.server";
import { adminApi } from "../lib/api.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { token } = await requireAuth(request);

  try {
    const data = await adminApi.universities.getAll(token);
    return json({ universities: data.universities || [] });
  } catch (error) {
    return json({ universities: [] });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { token } = await requireAuth(request);
  const formData = await request.formData();
  const action = formData.get("_action");
  const universityId = formData.get("universityId") as string;

  if (action === "delete" && universityId) {
    try {
      await adminApi.universities.delete(universityId, token);
      return json({ success: true });
    } catch (error) {
      return json({ error: "Failed to delete university" }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function AdminUniversities() {
  const { universities } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Universities</h1>
        <Link to="/admin/universities/new" className="btn btn-primary">
          + Add University
        </Link>
      </div>

      {universities.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No universities yet</p>
          <Link to="/admin/universities/new" className="btn btn-primary">
            Add Your First University
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university: any) => (
            <div key={university.id} className="card">
              {university.imageUrl && (
                <img
                  src={university.imageUrl}
                  alt={university.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{university.name}</h3>
              <p className="text-gray-600 mb-4">
                {university.city}, {university.country}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/admin/universities/${university.id}/edit`}
                  className="btn btn-secondary flex-1"
                >
                  Edit
                </Link>
                <Form method="post">
                  <input type="hidden" name="universityId" value={university.id} />
                  <button
                    type="submit"
                    name="_action"
                    value="delete"
                    className="btn btn-danger"
                    onClick={(e) => {
                      if (!confirm("Are you sure you want to delete this university?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
