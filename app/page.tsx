"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x * 0.02 + 'px',
            top: mousePosition.y * 0.02 + 'px',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: (1920 - mousePosition.x) * 0.01 + 'px',
            bottom: (1080 - mousePosition.y) * 0.01 + 'px',
            transition: 'all 0.5s ease-out'
          }}
        />
        <div className="absolute w-full h-full bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="text-2xl font-bold text-white tracking-wide">
                feed<span className="text-purple-300">karo</span>
              </div>
              <Link href='/placelist'><button className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10">Log In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-4rem)]">
          
          {/* Left Content */}
          <div className={`flex-1 max-w-2xl space-y-8 py-12 lg:py-20 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">Empower Your </span>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Business
                </span>
                <br />
                <span className="text-white">with Honest </span>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Feedback
                </span>
              </h1>
            </div>

            {/* Glass Card with Description */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="space-y-4 text-white/90">
                <p className="text-lg leading-relaxed">
                  Register your organization, purchase feedback slots, and gain actionable feedback to improve your services
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <p className="text-base leading-relaxed">
                  Browse registered places, share your experiences, and earn money for your valuable feedback
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button className="group px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <span className="flex items-center justify-center gap-2">
                  Learn More
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className={`flex-1 max-w-lg lg:max-w-xl transition-all duration-1000 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Floating Glass Cards */}
              <div className="relative z-10 space-y-6">
                
                {/* Main Dashboard Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500 animate-float">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-sm">Live Feedback</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
                    <div className="h-2 bg-gradient-to-r from-purple-400/60 to-blue-400/60 rounded-full w-3/4" />
                    <div className="h-2 bg-gradient-to-r from-purple-400/40 to-blue-400/40 rounded-full w-1/2" />
                  </div>
                </div>

                {/* Stats Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500 animate-float delay-200 ml-8">
                  <div className="text-white/90">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      98.5%
                    </div>
                    <div className="text-sm text-white/70">Customer Satisfaction</div>
                  </div>
                </div>

                {/* Reviews Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500 animate-float delay-400 mr-8">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-white/80 text-sm">Trusted by 10k+ businesses</div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: (Math.random() * 3 + 4) + 's'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float.delay-200 {
          animation-delay: -2s;
        }
        .animate-float.delay-400 {
          animation-delay: -4s;
        }
      `}</style>
    </div>
  );
}
