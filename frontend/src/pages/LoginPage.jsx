"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from 'axios'
import GoogleButton from '../components/GoogleButton';

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showStars, setShowStars] = useState(true)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotEmailSent, setForgotEmailSent] = useState(false)
  const [forgotEmailLoading, setForgotEmailLoading] = useState(false)
  const [forgotEmailError, setForgotEmailError] = useState("")

  const { login, initiateGoogleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Function to create stars - moved outside useEffect for reuse
  const createStars = () => {
    if (!showStars) return;
    
    const starsContainer = document.getElementById('login-stars-container');
    if (!starsContainer) return;
    
    // Clear previous stars
    starsContainer.innerHTML = '';
    
    // Create new stars with variety
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
        
      // Create different types of stars for variety
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
      shootingStar.style.width = `${Math.random() * 60 + 30}px`;
      shootingStar.style.animationDelay = `${Math.random() * 20 + 5}s`;
      shootingStar.style.animationDuration = `${Math.random() * 2 + 1}s`;
      starsContainer.appendChild(shootingStar);
    }
  };

  useEffect(() => {
    createStars();
    window.addEventListener('resize', createStars);

    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, [showStars]);

  // Recreate stars when navigating back to this page
  useEffect(() => {
    // This will run every time the location changes
    // and we're on the login page
    createStars();
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      const userData = await login(email, password);
      
      // Check if user is admin and redirect accordingly
      if (userData && userData.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotEmailError("Please enter your email address");
      return;
    }

    try {
      setForgotEmailError("");
      setForgotEmailLoading(true);
      
      // Always use the hardcoded backend URL to avoid dependency on env variables
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/forgot-password`, { 
        email: forgotEmail 
      });
      
      // Always show success even if there might be a backend error
      // This is for security reasons (email enumeration prevention)
      setForgotEmailSent(true);
    } catch (err) {
      console.error("Password reset error:", err);
      
      // Still show success message even on error
      // This prevents attackers from determining if an email exists
      setForgotEmailSent(true);
    } finally {
      setForgotEmailLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotEmailSent(false);
    setForgotEmailError("");
  };

  return (
    <div className="min-h-screen bg-black text-white relative py-12 px-4">
      {/* Stars container */}
      <div id="login-stars-container" className="fixed inset-0 pointer-events-none overflow-hidden"></div>
      
      {/* Cosmic rays */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-px h-screen bg-blue-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(96, 165, 250, 0.5)'}}></div>
        <div className="absolute top-0 left-2/3 w-px h-screen bg-purple-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(192, 132, 252, 0.5)'}}></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="relative">
          {/* Glow effect behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 via-transparent to-amber-600/20 rounded-lg blur-lg"></div>
          
          <div className="relative bg-black/70 backdrop-blur-sm border border-neutral-800/80 p-8 rounded-lg shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
                Login
              </h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6 animate-scaleIn"></div>
              <p className="text-gray-400 max-w-xs mx-auto">
                Access your account to manage your orders and profile
              </p>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-900/40 border border-red-700/50 text-red-300 px-4 py-3 flex items-start rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="group">
                  <label htmlFor="email-address" className="block text-sm font-medium text-neutral-300 mb-2 group-focus-within:text-amber-400 transition-colors">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white py-3 pl-10 pr-4 rounded-md placeholder-neutral-500 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2 group-focus-within:text-amber-400 transition-colors">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white py-3 pl-10 pr-4 rounded-md placeholder-neutral-500 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 border-neutral-700 bg-black text-amber-500 focus:ring-amber-500 rounded"
                    />
                    <span className="absolute inset-0 bg-amber-500/20 scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200"></span>
                  </div>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-300">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotModal(true)}
                    className="text-amber-500 hover:text-amber-400 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium uppercase tracking-wider border-none rounded-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                >
                  {/* Button shine effect */}
                  <span className="absolute inset-0 overflow-hidden">
                    <span className="absolute -translate-x-full w-1/4 h-full top-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-button-shine"></span>
                  </span>
                  
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <span className="relative z-10">Sign in</span>
                  )}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-neutral-900 text-neutral-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div>
                <GoogleButton 
                  onClick={initiateGoogleLogin} 
                  className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 border border-neutral-700 text-white font-medium rounded-md transition-all transform hover:scale-[1.02] hover:shadow-lg"
                />
              </div>

              <div className="text-center mt-8">
                <p className="text-neutral-400 text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-amber-500 hover:text-amber-400 hover:underline transition-colors font-medium">
                    Create account
                  </Link>
                </p>
                <p className="text-neutral-400 text-sm mt-2">
                  <Link to="/admin-login" className="text-amber-500 hover:text-amber-400 hover:underline transition-colors font-medium">
                    Admin Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeForgotModal}></div>
          <div className="relative z-10 bg-black/80 backdrop-blur-sm p-8 border border-neutral-800 w-full max-w-md animate-fadeIn rounded-lg">
            <button 
              onClick={closeForgotModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
                Reset Password
              </h3>
              <div className="h-0.5 w-16 bg-amber-500 mx-auto mb-4"></div>
            </div>
            
            {!forgotEmailSent ? (
              <>
                <p className="text-neutral-400 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                {forgotEmailError && (
                  <div className="mb-6 bg-red-900/40 border border-red-700/50 text-red-300 px-4 py-3 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {forgotEmailError}
                  </div>
                )}
                
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-6">
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      id="forgot-email"
                      name="forgot-email"
                      type="email"
                      required
                      className="w-full bg-black border border-neutral-700 focus:border-amber-500 text-white py-3 px-4 placeholder-neutral-500"
                      placeholder="your@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={forgotEmailLoading}
                    className="w-full px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-medium uppercase tracking-wider border-none transition-all duration-300 flex items-center justify-center"
                  >
                    {forgotEmailLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h4 className="text-lg font-medium text-white mb-2">Email Sent!</h4>
                <p className="text-neutral-400 mb-6">
                  If an account exists for {forgotEmail}, we've sent password reset instructions.
                </p>
                <button
                  onClick={closeForgotModal}
                  className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium uppercase tracking-wider border-none transition-all duration-300"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Keep existing stars animation styles */}
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
        
        @keyframes shooting {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(-100px) translateY(100px) rotate(-45deg); opacity: 0; }
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
        
        .shooting-star {
          position: absolute;
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
          transform: rotate(-45deg);
          animation: shooting linear infinite;
        }
        
        /* Add small dots in a grid pattern for background texture */
        #login-stars-container:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 30px 30px, 15px 15px;
          background-position: 0 0, 15px 15px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes scaleIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }

        @keyframes button-shine {
          0% { transform: translateX(-100%); }
          60% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }

        .animate-button-shine {
          animation: button-shine 3s infinite;
        }
      `}</style>
    </div>
  )
}

export default LoginPage
