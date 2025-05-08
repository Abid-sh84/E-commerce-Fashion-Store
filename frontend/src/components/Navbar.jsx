"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useWishlist } from "../contexts/WishlistContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, logout, currentUser } = useAuth()
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  useEffect(() => {
    const closeDropdown = () => {
      setShowProfileMenu(false);
    };
    
    document.addEventListener('click', closeDropdown);
    
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to products page with search query, reset any other filters
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  const handleProfileMenuToggle = (e) => {
    e.stopPropagation(); // Prevent document click from closing it immediately
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-black/90 backdrop-blur-md border-b border-neutral-800/50" 
          : "bg-transparent/85"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-600 rounded-full blur-sm opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 14H4V6h16v12z" className="text-amber-500" />
                  <path d="M6.5 10h11c.276 0 .5-.224.5-.5s-.224-.5-.5-.5h-11c-.276 0-.5.224-.5.5s.224.5.5.5zM6.5 12.5h11c.276 0 .5-.224.5-.5s-.224-.5-.5-.5h-11c-.276 0-.5.224-.5.5s.224.5.5.5zM6.5 15h11c.276 0 .5-.224.5-.5s-.224-.5-.5-.5h-11c-.276 0-.5.224-.5.5s.224.5.5.5z" className="text-white" />
                  <path d="M8 18h8v-9H8v9zm1-8h6v7H9v-7z" className="text-amber-400" />
                  <circle cx="12" cy="13.5" r="1.25" className="text-white" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 group-hover:from-amber-300 group-hover:to-amber-500 transition-all duration-300">Fashion Store</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`uppercase text-sm tracking-wider font-medium text-white hover:text-amber-500 transition-all duration-300 relative ${location.pathname === "/" && "text-amber-500"}`}
            >
              <span className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-amber-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              Home
            </Link>
            
            <Link
              to="/products"
              className={`uppercase text-sm tracking-wider font-medium text-white hover:text-amber-500 transition-all duration-300 relative ${location.pathname === "/products" && "text-amber-500"}`}
            >
              <span className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-amber-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              Shop
            </Link>

            <Link
              to="/about"
              className={`uppercase text-sm tracking-wider font-medium text-white hover:text-amber-500 transition-all duration-300 relative ${location.pathname === "/about" && "text-amber-500"}`}
            >
              <span className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-amber-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              About
            </Link>
            
            <Link
              to="/contact"
              className={`uppercase text-sm tracking-wider font-medium text-white hover:text-amber-500 transition-all duration-300 relative ${location.pathname === "/contact" && "text-amber-500"}`}
            >
              <span className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-amber-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              Contact
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-white hover:text-amber-500 transition-colors duration-300"
                title="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <div className="relative">
                <Link 
                  to="/wishlist"
                  className={`p-2 text-white hover:text-amber-500 transition-colors duration-300 `}
                  title="Wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistItems.length > 0 && (
                    <span className="absolute top-3 -right-2 bg-amber-600 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center border border-amber-400 font-medium shadow-md">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </div>
              
              <div className=" relative">
                <Link 
                  to="/cart"
                  className={`p-2 text-white hover:text-amber-500 transition-colors duration-300  `}
                  title="Cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItems.length > 0 && (
                    <span className="absolute top-3 -right-2 bg-amber-600 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center border border-amber-400 font-medium shadow-md">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={handleProfileMenuToggle}
                  className="flex items-center space-x-1 text-white hover:text-amber-500 transition-colors duration-300"
                  title={currentUser?.name || "Profile"}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700">
                    <img 
                      src={currentUser?.avatar || "/images/avatars/default.png"}
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
                
                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-neutral-800 shadow-lg py-1 z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-white hover:bg-neutral-900 hover:text-amber-500"
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/profile?tab=orders" 
                      className="block px-4 py-2 text-sm text-white hover:bg-neutral-900 hover:text-amber-500"
                    >
                      My Orders
                    </Link>
                    {currentUser?.isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        className="block px-4 py-2 text-sm text-white hover:bg-neutral-900 hover:text-amber-500"
                      >
                        Go to Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-neutral-800 my-1"></div>
                    <button 
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }} 
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-900 hover:text-amber-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="uppercase tracking-wider px-4 py-2 text-sm bg-amber-700 hover:bg-amber-600 transition-colors duration-300 text-white font-medium"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setShowSearch(true)} className="p-2 text-white mr-2 hover:text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <div className="relative mr-2">
              <Link to="/cart" className="text-white hover:text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border border-amber-400 font-medium shadow-md">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-white hover:text-amber-500 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-neutral-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium ${location.pathname === "/" ? "text-amber-500" : "text-white hover:text-amber-500"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium ${location.pathname === "/products" ? "text-amber-500" : "text-white hover:text-amber-500"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium ${location.pathname === "/about" ? "text-amber-500" : "text-white hover:text-amber-500"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium ${location.pathname === "/contact" ? "text-amber-500" : "text-white hover:text-amber-500"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/cart"
              className="flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium text-white hover:text-amber-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart ({cartItems.length})
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium text-white hover:text-amber-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist ({wishlistItems.length})
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium text-white hover:text-amber-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {currentUser?.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center uppercase tracking-wider px-3 py-2 text-base font-medium text-amber-500 hover:text-amber-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Go to Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full text-left uppercase tracking-wider px-3 py-2 text-base font-medium text-white hover:text-amber-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 text-base font-medium bg-amber-700 text-white hover:bg-amber-600 uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="w-full max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full bg-neutral-900 text-white border border-neutral-800 focus:border-amber-600 p-3 text-lg placeholder-neutral-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white uppercase tracking-wider transition-colors"
              >
                Search
              </button>
            </form>
            
            <button
              onClick={() => setShowSearch(false)}
              className="absolute -top-12 right-0 text-white hover:text-amber-500 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </nav>
  )
}

export default Navbar
