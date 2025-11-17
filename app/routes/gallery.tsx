import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { api } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Gallery - MATHWA" },
    { name: "description", content: "Browse our gallery of university campuses, facilities, and student life" },
    { property: "og:title", content: "Gallery - MATHWA" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const data = await api.gallery.getAll();
    return json({ gallery: data.gallery || [] });
  } catch (error) {
    return json({ gallery: [] });
  }
}

export default function Gallery() {
  const { gallery } = useLoaderData<typeof loader>();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our universities, campus facilities, and vibrant student life
            </p>
          </div>

          {gallery.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No images available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((image: any) => (
                <div 
                  key={image.id} 
                  className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title || "Gallery image"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {image.title && (
                    <div className="p-4 bg-white">
                      <h3 className="font-semibold text-gray-800">{image.title}</h3>
                      {image.university && (
                        <p className="text-sm text-gray-600">{image.university.name}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="max-w-4xl w-full">
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title || "Gallery image"} 
              className="w-full h-auto rounded-lg"
            />
            {selectedImage.title && (
              <div className="mt-4 text-white text-center">
                <h3 className="text-2xl font-semibold">{selectedImage.title}</h3>
                {selectedImage.university && (
                  <p className="text-lg text-gray-300">{selectedImage.university.name}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
