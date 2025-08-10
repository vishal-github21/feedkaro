'use client'
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Place{
  id:string,
  link:string,
  name:string,
  balance:BigInteger  
}

const YourPlaces = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const clerk_id = searchParams.get('clerk_id');
  const name = searchParams.get('name');
  const [places,setplaces]=useState<Place[]>([])
  
  useEffect(() => {
    const fetchplaces = async () => {
      try {
        const response = await axios.get("/api/fetchyourplaces", {
          params: { userId: id }
        });
        const data = response.data;
        console.log(data);
        setplaces(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchplaces()
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000 bottom-10 right-10" />
        <div className="absolute w-full h-full bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
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
      <div className="relative z-10">
        {/* Header Section */}
        <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl md:h-[28vh] h-[20vh] flex items-center justify-between md:px-24 px-5">
          <div className="flex-col">
            <div className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Dashboard
            </div>
            <div className="md:text-base text-sm font-light mt-2 pl-1 text-white/70">
              <span className="text-purple-300">user id:</span> {id}
            </div>
          </div>
          
          <div className="flex items-center">
            <Link href={{
              pathname: "/addplace",
              query: {
                id: id,
                clerk_id: clerk_id,
                name: name
              }
            }}>
              <button className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Place
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </div>
        </div>

        {/* Places Container */}
        <div className="md:mx-[8%] mx-[4%] mt-8">
          <div className="h-[65vh] overflow-y-auto custom-scrollbar space-y-6 pr-4">
            {places.length > 0 ? (
              places.map((place, index) => (
                <div
                  key={place.id}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'slideUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        {place.name}
                      </h3>
                      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 mb-4 group hover:bg-white/10 transition-all duration-300">
                        <a 
                          href={place.link} 
                          className="text-sm font-mono text-blue-300 hover:text-blue-200 break-all transition-colors duration-300 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {place.link}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 px-4 py-2 rounded-xl">
                        <div className="text-green-300 font-bold text-lg">
                          ₹{place.balance?.toString() || '0'}
                        </div>
                        <div className="text-green-200/70 text-xs mt-1">Balance</div>
                      </div>
                      
                      <Link href={{
                        pathname: "/addbalance",
                        query: {
                          placeid: place.id,
                          id: id
                        }
                      }}>
                        <button className="group relative overflow-hidden px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                          <span className="relative z-10 flex items-center gap-2">
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Balance
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-2xl">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 backdrop-blur-md bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No places found</h3>
                  <p className="text-white/70 mb-6">Start by adding your first business place to get feedback from customers.</p>
                  <Link href={{
                    pathname: "/addplace",
                    query: {
                      id: id,
                      clerk_id: clerk_id,
                      name: name
                    }
                  }}>
                    <button className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <span className="relative z-10">Add Your First Place</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default YourPlaces;
