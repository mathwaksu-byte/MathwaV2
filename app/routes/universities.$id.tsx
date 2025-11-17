import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { api } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.university) {
    return [{ title: "University Not Found - MATHWA" }];
  }
  return [
    { title: `${data.university.name} - MATHWA` },
    { name: "description", content: data.university.description || `Learn more about ${data.university.name}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const data = await api.universities.getById(params.id!);
    return json({ university: data.university });
  } catch (error) {
    throw new Response("University Not Found", { status: 404 });
  }
}

export default function UniversityDetail() {
  const { university } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{university.name}</h1>
            <p className="text-xl">📍 {university.city}, {university.country}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Card */}
            <div className="lg:col-span-2">
              {university.imageUrl && (
                <img src={university.imageUrl} alt={university.name} className="w-full h-96 object-cover rounded-xl mb-8" />
              )}
              
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{university.description || "No description available."}</p>
              </div>

              {/* Programs */}
              {university.programs && university.programs.length > 0 && (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold mb-6">Available Programs</h2>
                  <div className="space-y-4">
                    {university.programs.map((program: any) => (
                      <div key={program.id} className="border-l-4 border-primary-500 pl-4 py-2">
                        <h3 className="text-xl font-semibold mb-1">{program.name}</h3>
                        <p className="text-gray-600 mb-2">⏱️ {program.duration}</p>
                        {program.fee && <p className="text-primary-600 font-medium">${Number(program.fee).toLocaleString()}</p>}
                        {program.description && <p className="text-gray-700 mt-2">{program.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{university.city}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Country:</span>
                    <span>{university.country}</span>
                  </li>
                  {university.ranking && (
                    <li className="flex justify-between">
                      <span className="font-medium">Ranking:</span>
                      <span>#{university.ranking}</span>
                    </li>
                  )}
                  {university.tuitionFee && (
                    <li className="flex justify-between">
                      <span className="font-medium">Tuition:</span>
                      <span>${Number(university.tuitionFee).toLocaleString()}/year</span>
                    </li>
                  )}
                </ul>
                
                <Link to="/apply" className="btn btn-primary w-full mt-6">
                  Apply Now
                </Link>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {university.gallery && university.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {university.gallery.map((image: any) => (
                  <img key={image.id} src={image.imageUrl} alt={image.title || "Gallery"} className="w-full h-48 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
