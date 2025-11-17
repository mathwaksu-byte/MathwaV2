import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { api } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.program) {
    return [{ title: "Program Not Found" }];
  }
  
  return [
    { title: `${data.program.name} - MATHWA` },
    { name: "description", content: data.program.description || `Study ${data.program.name}` },
    { property: "og:title", content: `${data.program.name} - MATHWA` },
    { property: "og:description", content: data.program.description || "" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const data = await api.programs.getById(id);
    return json({ program: data.program });
  } catch (error) {
    throw new Response("Program Not Found", { status: 404 });
  }
}

export default function ProgramDetail() {
  const { program } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link to="/" className="text-primary-600 hover:text-primary-700">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/universities" className="text-primary-600 hover:text-primary-700">Universities</Link>
            <span className="mx-2">/</span>
            {program.university && (
              <>
                <Link to={`/universities/${program.university.id}`} className="text-primary-600 hover:text-primary-700">
                  {program.university.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-gray-500">{program.name}</span>
          </nav>

          {/* Program Header */}
          <div className="card mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{program.name}</h1>
            
            {program.university && (
              <Link 
                to={`/universities/${program.university.id}`}
                className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
              >
                {program.university.name}
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-lg font-semibold">{program.duration}</p>
              </div>
              
              {program.fee && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tuition Fee</p>
                  <p className="text-lg font-semibold">${program.fee}/year</p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Action</p>
                <Link to="/apply" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Apply Now →
                </Link>
              </div>
            </div>
          </div>

          {/* Program Details */}
          {program.description && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4">Program Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{program.description}</p>
              </div>
            </div>
          )}

          {/* Eligibility */}
          {program.eligibility && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4">Eligibility Criteria</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{program.eligibility}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
            <p className="text-gray-700 mb-6">
              Start your application for {program.name} today and take the first step toward your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply" className="btn btn-primary">
                Apply Now
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
