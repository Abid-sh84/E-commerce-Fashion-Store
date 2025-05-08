import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GoogleAuthCallback = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  
  // Create stars effect for background
  useEffect(() => {
    const createStars = () => {
      if (!showStars) return;
      
      const starsContainer = document.getElementById('callback-stars-container');
      if (!starsContainer) return;
      
      // Clear previous stars
      starsContainer.innerHTML = '';
      
      // Create stars
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
          
        if (i % 5 === 0) {
          // Larger, brighter stars
          star.className = 'star glow';
          star.style.width = `${Math.random() * 4 + 2}px`;
          star.style.height = star.style.width;
          star.style.boxShadow = '0 0 4px 1px rgba(255, 255, 255, 0.6)';
        } else if (i % 7 === 0) {
          // Colorful stars
          star.className = 'star colored';
          star.style.width = `${Math.random() * 3 + 1}px`;
          star.style.height = star.style.width;
          const colors = ['#fcf0bc', '#e0f7fa', '#fff8e1', '#f3e5f5'];
          star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        } else {
          // Regular stars
          star.className = 'star';
          star.style.width = `${Math.random() * 3 + 0.5}px`;
          star.style.height = star.style.width;
        }
        
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 5 + 1}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
      }
      
      // Add a few shooting stars
      for (let i = 0; i < 3; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.left = `${Math.random() * 100}vw`;
        shootingStar.style.top = `${Math.random() * 50}vh`;
        shootingStar.style.width = `${Math.random() * 100 + 50}px`;
        shootingStar.style.animationDuration = `${Math.random() * 3 + 2}s`;
        shootingStar.style.animationDelay = `${Math.random() * 15}s`;
        starsContainer.appendChild(shootingStar);
      }
    };

    createStars();
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, [showStars]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        
        // Get token from URL parameters
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const errorMsg = params.get("error");
        
        if (errorMsg) {
          console.error("Error from Google auth:", errorMsg);
          setError(`Authentication failed: ${errorMsg}`);
          setLoading(false);
          return;
        }
        
        if (!token) {
          console.error("No token received from Google auth");
          setError("Authentication failed: No token received");
          setLoading(false);
          return;
        }
        
        console.log("Token received, completing authentication...");
        
        // Complete Google authentication process
        await loginWithGoogle(token);
        
        // Get redirect target (or default to home)
        const redirectTarget = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        
        // Navigate to destination
        navigate(redirectTarget);
      } catch (error) {
        console.error("Google auth callback error:", error);
        setError(`Authentication failed: ${error.message || "Unknown error"}`);
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [navigate, loginWithGoogle]);
  
  // Show loading or error state
  return (
    <div className="min-h-dvh bg-black text-white relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Stars container */}
      <div id="callback-stars-container" className="fixed inset-0 pointer-events-none overflow-hidden"></div>
      
      {/* Cosmic rays */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-px h-dvh bg-amber-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(251, 191, 36, 0.5)'}}></div>
        <div className="absolute top-0 left-2/3 w-px h-dvh bg-amber-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(251, 191, 36, 0.5)'}}></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 mx-auto">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/30 via-amber-500/30 to-amber-400/30 rounded-xl blur-lg"></div>
        
        <div className="relative bg-black/80 backdrop-blur-md p-8 rounded-xl border border-neutral-800 shadow-lg shadow-amber-900/30">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin h-12 w-12 border-4 border-neutral-800 border-t-amber-500 rounded-full mb-4"></div>
              <h2 className="text-2xl font-bold text-amber-500 mb-2 uppercase tracking-wider">Completing Authentication</h2>
              <p className="text-neutral-400">Please wait while we log you in...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 border-2 border-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-500 mb-2 uppercase tracking-wider">Authentication Failed</h2>
              <p className="text-neutral-400 mb-6">{error}</p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold uppercase tracking-wider border-none transition-all duration-300 transform hover:scale-105"
              >
                Back to Login
              </button>
            </div>
          ) : null}
        
          {/* Comic style decorative elements */}
          <div className="absolute -top-4 -left-4 h-8 w-8 bg-amber-500 rounded-full opacity-70 blur-md"></div>
          <div className="absolute -bottom-4 -right-4 h-8 w-8 bg-amber-500 rounded-full opacity-70 blur-md"></div>
        </div>
        
        {/* Comic style decorations */}
        <div className="absolute -top-3 -right-3 transform rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </div>

      {/* Add CSS for stars animation */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        
        @keyframes colored-twinkle {
          0% { opacity: 0.1; }
          50% { opacity: 0.8; }
          100% { opacity: 0.1; }
        }
        
        @keyframes glow {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }
        
        .star.colored {
          animation: colored-twinkle linear infinite;
        }
        
        .star.glow {
          animation: glow linear infinite;
        }

        @keyframes shooting {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(-100px) translateY(100px) rotate(-45deg); opacity: 0; }
        }
        
        .shooting-star {
          position: absolute;
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
          transform: rotate(-45deg);
          animation: shooting linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GoogleAuthCallback;
