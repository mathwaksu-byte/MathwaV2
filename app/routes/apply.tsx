import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import { api } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Apply Now - MATHWA" },
    { name: "description", content: "Submit your application to study at Kyrgyz State University" },
    { property: "og:title", content: "Apply Now - MATHWA" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [universitiesData, programsData] = await Promise.all([
      api.universities.getAll(),
      api.programs.getAll(),
    ]);

    return json({
      universities: universitiesData.universities || [],
      programs: programsData.programs || [],
    });
  } catch (error) {
    return json({ universities: [], programs: [] });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const universityId = formData.get("universityId") as string;
  const programId = formData.get("programId") as string;

  // Validation
  if (!name || !email || !universityId || !programId) {
    return json(
      { error: "Please fill in all required fields" },
      { status: 400 }
    );
  }

  try {
    // Submit contact message with application details
    await api.messages.create({
      name,
      email,
      phone,
      message: `Application Request\nUniversity ID: ${universityId}\nProgram ID: ${programId}\n\nAdditional Message:\n${message || "No additional message"}`,
    });

    return redirect("/apply/success");
  } catch (error) {
    return json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}

export default function Apply() {
  const { universities, programs } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Apply Now</h1>
            <p className="text-xl text-gray-600">
              Start your journey to studying at Kyrgyz State University
            </p>
          </div>

          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{actionData.error}</p>
            </div>
          )}

          <div className="card">
            <Form method="post" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label htmlFor="universityId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select University *
                </label>
                <select
                  id="universityId"
                  name="universityId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose a university</option>
                  {universities.map((uni: any) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} - {uni.city}, {uni.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Program *
                </label>
                <select
                  id="programId"
                  name="programId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose a program</option>
                  {programs.map((program: any) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.duration})
                      {program.university && ` - ${program.university.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about your educational background, interests, or any questions you have..."
                />
              </div>

              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> After submitting this form, our admissions team will contact you 
                  within 24-48 hours to guide you through the next steps of the application process.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </Form>
          </div>

          {/* Information Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-semibold mb-2">Step 1: Apply</h3>
              <p className="text-sm text-gray-600">Submit your application form</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-semibold mb-2">Step 2: Review</h3>
              <p className="text-sm text-gray-600">We'll review and contact you</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="font-semibold mb-2">Step 3: Enroll</h3>
              <p className="text-sm text-gray-600">Complete documentation and enroll</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
