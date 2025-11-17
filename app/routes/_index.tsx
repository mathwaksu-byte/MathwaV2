import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { api } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "MATHWA - Study in Kyrgyz State University" },
    { name: "description", content: "Official partner for international students. Get expert consultation and comprehensive support for studying at Kyrgyz State University." },
    { property: "og:title", content: "MATHWA - Kyrgyz State University Partner" },
    { property: "og:description", content: "Expert consultation and application support for international students" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [universitiesData, contentData] = await Promise.all([
      api.universities.getAll(),
      api.content.getByKey('homepage_hero').catch(() => null),
    ]);

    return json({
      universities: universitiesData.universities || [],
      heroContent: contentData?.content || null,
    });
  } catch (error) {
    return json({ universities: [], heroContent: null });
  }
}

export default function Index() {
  const { universities, heroContent } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {heroContent?.title || "Study at Kyrgyz State University"}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                {heroContent?.body || "Your pathway to world-class education with expert guidance"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply" className="btn btn-secondary">
                  Apply Now
                </Link>
                <Link to="/universities" className="btn bg-white/10 text-white hover:bg-white/20">
                  Explore Universities
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose MATHWA?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Consultation</h3>
                <p className="text-gray-600">Professional guidance throughout your application process</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">International Programs</h3>
                <p className="text-gray-600">Wide range of programs in English and Russian</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Support</h3>
                <p className="text-gray-600">From application to arrival and beyond</p>
              </div>
            </div>
          </div>
        </section>

        {/* Universities Preview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Universities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {universities.slice(0, 3).map((university: any) => (
                <Link key={university.id} to={`/universities/${university.id}`} className="card">
                  {university.imageUrl && (
                    <img src={university.imageUrl} alt={university.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{university.name}</h3>
                    <p className="text-gray-600 mb-4">{university.city}, {university.country}</p>
                    {university.ranking && (
                      <span className="text-sm text-primary-600 font-medium">Ranking: #{university.ranking}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link to="/universities" className="btn btn-primary">
                View All Universities
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8">Get personalized consultation and begin your application today</p>
            <Link to="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
