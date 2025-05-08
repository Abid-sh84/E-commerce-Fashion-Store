// filepath: c:\Users\Shamim shaikh\Desktop\example push\E-com\frontend\src\pages\AdminLoginPage.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const AdminLoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showStars, setShowStars] = useState(true)

  const { login } = useAuth()
  const navigate = useNavigate()

  // Create stars effect for background
  useEffect(() => {
    const createStars = () => {
      if (!showStars) return;
      
      const starsContainer = document.getElementById('admin-login-stars-container');
      if (!starsContainer) return;
      
      // Clear previous stars
      starsContainer.innerHTML = '';
      
      // Create new stars with variety
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
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      const userData = await login(email, password);
      
      // Check if user is admin
      if (userData && userData.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        setError("Access denied. You don't have administrator privileges.");
      }
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-black text-white relative py-12 px-4">
      {/* Stars container */}
      <div id="admin-login-stars-container" className="fixed inset-0 pointer-events-none overflow-hidden"></div>
      
      {/* Cosmic rays */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-px h-dvh bg-amber-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(245, 158, 11, 0.5)'}}></div>
        <div className="absolute top-0 left-2/3 w-px h-dvh bg-amber-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(245, 158, 11, 0.5)'}}></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="relative">
          {/* Glow effect behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 via-transparent to-amber-600/20 rounded-lg blur-lg"></div>
          
          <div className="relative bg-black/70 backdrop-blur-sm border border-neutral-800/80 p-8 rounded-lg shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
                Admin Login
              </h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6 animate-scaleIn"></div>
              <p className="text-gray-400 max-w-xs mx-auto">
                Secure access for store administrators
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
                    Admin Email
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
                      placeholder="Enter admin email"
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
                      placeholder="Enter admin password"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
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
                      Authenticating...
                    </>
                  ) : (
                    <span className="relative z-10">Access Admin Panel</span>
                  )}
                </button>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-neutral-400 text-sm">
                  <a href="/" className="text-amber-500 hover:text-amber-400 hover:underline transition-colors font-medium">
                    Return to Store
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
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
        #admin-login-stars-container:before {
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

export default AdminLoginPage