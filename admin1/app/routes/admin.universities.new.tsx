import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { requireAuth } from "../lib/auth.server";
import { adminApi } from "../lib/api.server";

export async function action({ request }: ActionFunctionArgs) {
  const { token } = await requireAuth(request);
  const formData = await request.formData();
  
  const name = formData.get("name") as string;
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;
  const description = formData.get("description") as string;
  const ranking = formData.get("ranking") as string;
  const tuitionFee = formData.get("tuitionFee") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !country || !city) {
    return json({ error: "Name, country, and city are required" }, { status: 400 });
  }

  try {
    await adminApi.universities.create(
      {
        name,
        country,
        city,
        description,
        ranking: ranking ? parseInt(ranking) : null,
        tuitionFee: tuitionFee ? parseFloat(tuitionFee) : null,
        imageUrl,
      },
      token
    );

    return redirect("/admin/universities");
  } catch (error) {
    return json({ error: "Failed to create university" }, { status: 500 });
  }
}

export default function NewUniversity() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New University</h1>

      {actionData?.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{actionData.error}</p>
        </div>
      )}

      <div className="card">
        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              University Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ranking" className="block text-sm font-medium text-gray-700 mb-2">
                Ranking
              </label>
              <input
                type="number"
                id="ranking"
                name="ranking"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="tuitionFee" className="block text-sm font-medium text-gray-700 mb-2">
                Tuition Fee (USD/year)
              </label>
              <input
                type="number"
                id="tuitionFee"
                name="tuitionFee"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create University"}
            </button>
            <a href="/admin/universities" className="btn btn-secondary">
              Cancel
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
