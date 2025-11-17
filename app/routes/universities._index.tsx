import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { api } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Universities - MATHWA" },
    { name: "description", content: "Browse universities and programs available through MATHWA partnership" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const data = await api.universities.getAll();
    return json({ universities: data.universities || [] });
  } catch (error) {
    return json({ universities: [] });
  }
}

export default function Universities() {
  const { universities } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Partner Universities</h1>
            <p className="text-xl text-gray-600">Explore world-class institutions and find your perfect match</p>
          </div>

          {universities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No universities available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {universities.map((university: any) => (
                <Link key={university.id} to={`/universities/${university.id}`} className="card hover:scale-105 transition-transform">
                  {university.imageUrl && (
                    <img src={university.imageUrl} alt={university.name} className="w-full h-56 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{university.name}</h3>
                    <p className="text-gray-600 mb-4">
                      📍 {university.city}, {university.country}
                    </p>
                    {university.description && (
                      <p className="text-gray-700 mb-4 line-clamp-3">{university.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      {university.ranking && (
                        <span className="text-sm font-semibold text-primary-600">Rank #{university.ranking}</span>
                      )}
                      {university.tuitionFee && (
                        <span className="text-sm text-gray-600">From ${Number(university.tuitionFee).toLocaleString()}/year</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
