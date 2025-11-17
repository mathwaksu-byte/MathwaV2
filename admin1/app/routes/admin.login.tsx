import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getAuthToken, createAuthCookie } from "../lib/auth.server";

const API_URL = process.env.API_URL || "http://localhost:8787";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getAuthToken(request);
  if (token) {
    return redirect("/admin/dashboard");
  }
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { token, user } = await response.json();

    if (user.role !== "ADMIN" && user.role !== "EDITOR") {
      return json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    return redirect("/admin/dashboard", {
      headers: {
        "Set-Cookie": createAuthCookie(token),
      },
    });
  } catch (error) {
    return json({ error: "Login failed" }, { status: 500 });
  }
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MATHWA Admin</h1>
            <p className="text-gray-600">Sign in to access dashboard</p>
          </div>

          {actionData?.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {actionData.error}
            </div>
          )}

          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="input"
                placeholder="admin@mathwa.kg"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
