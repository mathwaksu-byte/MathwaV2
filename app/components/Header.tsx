import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">MATHWA</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/universities" className="text-gray-700 hover:text-primary-600 transition">
              Universities
            </Link>
            <Link to="/gallery" className="text-gray-700 hover:text-primary-600 transition">
              Gallery
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition">
              Contact
            </Link>
            <Link to="/apply" className="btn btn-primary text-sm">
              Apply Now
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
