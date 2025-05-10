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

  const { signup, initiateGoogleLogin } = useAuth()
  const navigate = useNavigate()

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
      <div className="max-w-md mx-auto relative z-10">
        <div className="relative">
          
          <div className="relative bg-black border border-neutral-700 p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider">
                <span className="text-white">Create Account</span>
                <div className="h-0.5 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6 animate-scaleIn"></div>
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
                  className="w-full px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-medium uppercase tracking-wider border-none rounded-md transition-all duration-300 flex items-center justify-center"
                >
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
                    <span>Create Account</span>
                  )}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-neutral-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div>
                <GoogleButton 
                  onClick={initiateGoogleLogin} 
                  text="Sign up with Google"
                  className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-medium rounded-md transition-all"
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
    </div>
  )
}

export default SignupPage