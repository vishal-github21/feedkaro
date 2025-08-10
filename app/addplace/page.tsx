"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const AddPlace = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [placename, setPlacename] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const router = useRouter();
  
  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post("/api/addplace", {
        UserId: id,
        name: placename,
        link: link,
        img: img,
      });
      console.log(response.data);
      router.push(`/yourplaces?id=${id}`);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000 bottom-10 right-10" />
        <div className="absolute w-full h-full bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: (Math.random() * 3 + 4) + 's'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex justify-center items-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl md:min-h-[75vh] w-full max-w-4xl overflow-hidden">
          {/* Header Section */}
          <div className="backdrop-blur-xl bg-white/5 border-b border-white/20 md:h-[32vh] h-[20vh] flex items-center justify-between md:px-24 px-5">
            <div className="flex-col">
              <div className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Add Place
              </div>
              <div className="md:text-base text-xs mt-2 pl-1 text-white/70 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-purple-300">user id:</span> {id}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-16 h-16 backdrop-blur-md bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:p-12">
            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Form Fields Row */}
              <div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
                {/* Place Name Field */}
                <div className="flex-1">
                  <label htmlFor="placename" className="block text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Place Name
                  </label>
                  <input
                    type="text"
                    id="placename"
                    value={placename}
                    onChange={(e) => setPlacename(e.target.value)}
                    className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                {/* Image Upload Field */}
                <div className="flex-1">
                  <label htmlFor="img" className="block text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Business Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="img"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500/30 file:text-white hover:file:bg-purple-500/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Link Field */}
              <div>
                <label htmlFor="link" className="block text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Business Website/Link
                </label>
                <input
                  type="text"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                  placeholder="https://your-business-website.com"
                  required
                />
              </div>

              {/* Image Preview */}
              {img && (
                <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4">
                  <p className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Image Preview
                  </p>
                  <div className="backdrop-blur-sm bg-white/5 rounded-lg p-2 max-w-xs">
                    <img src={img} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 hover:from-purple-600 hover:via-blue-600 hover:to-green-600 text-white font-bold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl min-w-[200px]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Place
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        input[type="file"]::-webkit-file-upload-button {
          visibility: hidden;
        }
        
        input[type="file"]::before {
          content: 'Choose File';
          display: inline-block;
          background: rgba(147, 51, 234, 0.3);
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          margin-right: 1rem;
          cursor: pointer;
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        input[type="file"]:hover::before {
          background: rgba(147, 51, 234, 0.5);
        }
      `}</style>
    </main>
  );
};

export default AddPlace;
