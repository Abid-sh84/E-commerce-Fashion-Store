"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import GoogleButton from '../components/GoogleButton';

const SignupPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showStars, setShowStars] = useState(true)

  const { signup, initiateGoogleLogin } = useAuth()
  const navigate = useNavigate()
  
  // Create stars effect
  useEffect(() => {
    const createStars = () => {
      if (!showStars) return;
      
      const starsContainer = document.getElementById('signup-stars-container');
      if (!starsContainer) return;
      
      // Clear previous stars
      starsContainer.innerHTML = '';
      
      // Create new stars
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

    createStars();
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, [showStars]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setError("")
      setIsLoading(true)

      await signup(name, email, password)
      navigate("/")
    } catch (err) {
      setError("Failed to create an account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-black text-white relative py-12 px-4">
      {/* Stars container */}
      <div id="signup-stars-container" className="fixed inset-0 pointer-events-none overflow-hidden"></div>
      
      {/* Cosmic rays */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-px h-dvh bg-blue-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(96, 165, 250, 0.5)'}}></div>
        <div className="absolute top-0 left-2/3 w-px h-dvh bg-purple-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(192, 132, 252, 0.5)'}}></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="relative">
          {/* Glow effect behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 via-transparent to-amber-600/20 rounded-lg blur-lg"></div>
          
          <div className="relative bg-black/70 backdrop-blur-sm border border-neutral-800/80 p-8 rounded-lg shadow-xl">
            <div className="text-center mb-8">
              <h2 className="relative text-3xl font-bold mb-4 uppercase tracking-wider animate-fadeIn">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Create Account</span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-[3px] w-16 bg-gradient-to-r from-amber-400 to-amber-600 animate-scaleIn"></span>
              </h2>
              <p className="text-gray-400 max-w-xs mx-auto mt-4">
                Join us to explore our premium collection
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
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2 group-focus-within:text-amber-400 transition-colors">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white py-3 pl-10 pr-4 rounded-md placeholder-neutral-500 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white py-3 pl-10 pr-4 rounded-md placeholder-neutral-500 transition-all duration-300"
                      placeholder="Create a password"
                    />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">Must be at least 6 characters</p>
                </div>
                
                <div className="group">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-300 mb-2 group-focus-within:text-amber-400 transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white py-3 pl-10 pr-4 rounded-md placeholder-neutral-500 transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                  </div>
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
                      Creating Account...
                    </>
                  ) : (
                    <span className="relative z-10">Create Account</span>
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
                  text="Sign up with Google"
                  className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 border border-neutral-700 text-white font-medium rounded-md transition-all transform hover:scale-[1.02] hover:shadow-lg"
                />
              </div>

              <div className="text-center mt-8">
                <p className="text-neutral-400 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-amber-500 hover:text-amber-400 hover:underline transition-colors font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Stars animation styles */}
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
        #signup-stars-container:before {
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

export default SignupPage