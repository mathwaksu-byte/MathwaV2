import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { api } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "About Us - MATHWA" },
    { name: "description", content: "Learn about MATHWA - Your trusted partner for studying at Kyrgyz State University" },
    { property: "og:title", content: "About MATHWA" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const data = await api.content.getByKey('about_section').catch(() => null);
    return json({ aboutContent: data?.content || null });
  } catch (error) {
    return json({ aboutContent: null });
  }
}

export default function About() {
  const { aboutContent } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {aboutContent?.title || "About MATHWA"}
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              {aboutContent?.body || "Your trusted partner for international education"}
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  MATHWA is the official partner of Kyrgyz State University, dedicated to helping 
                  international students achieve their academic dreams. We provide comprehensive 
                  support throughout your educational journey.
                </p>
                <p className="text-lg text-gray-700">
                  From initial consultation to arrival and beyond, we're here to ensure your 
                  experience is smooth, successful, and rewarding.
                </p>
              </div>
              {aboutContent?.imageUrl && (
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src={aboutContent.imageUrl} 
                    alt="About MATHWA" 
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose MATHWA?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
                <p className="text-gray-600">
                  Professional consultation from experienced education advisors who understand 
                  your needs and aspirations.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Official Partnership</h3>
                <p className="text-gray-600">
                  Direct partnership with Kyrgyz State University ensures authentic and reliable 
                  information and processes.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Complete Support</h3>
                <p className="text-gray-600">
                  End-to-end assistance with application, documentation, visa, accommodation, 
                  and settling in.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Wide Range of Programs</h3>
                <p className="text-gray-600">
                  Access to diverse undergraduate and postgraduate programs in various fields 
                  of study.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Affordable Education</h3>
                <p className="text-gray-600">
                  Quality education at competitive tuition fees with transparent pricing and 
                  no hidden costs.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Student Community</h3>
                <p className="text-gray-600">
                  Join a vibrant international student community with ongoing support and 
                  networking opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Journey Today</h2>
            <p className="text-xl mb-8">
              Ready to take the next step in your education? Get in touch with us for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply" className="btn btn-secondary">
                Apply Now
              </Link>
              <Link to="/contact" className="btn bg-white/10 text-white hover:bg-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
