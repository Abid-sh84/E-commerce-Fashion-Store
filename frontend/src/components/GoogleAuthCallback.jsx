import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GoogleAuthCallback = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

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
        
        {/* Comic style decorations */}          <div className="absolute -top-3 -right-3 transform rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
