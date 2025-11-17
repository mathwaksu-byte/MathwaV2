import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Application Submitted - MATHWA" },
    { name: "robots", content: "noindex" },
  ];
};

export default function ApplySuccess() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✓</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-lg text-gray-700 mb-6">
              Thank you for your interest in studying at Kyrgyz State University through MATHWA.
            </p>
            
            <div className="bg-primary-50 p-6 rounded-lg mb-8 text-left">
              <h2 className="font-semibold text-lg mb-3">What happens next?</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Our admissions team will review your application within 24-48 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>You will receive an email with next steps and required documents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>A dedicated counselor will be assigned to guide you through the process</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>We'll schedule a consultation call to discuss your application in detail</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Please check your email (including spam folder) for our response.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="btn btn-primary">
                  Return Home
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
