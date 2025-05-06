"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import apiClient from "../api/client"
import { getTopProducts, getNewProducts, getProductCategories } from "../api/products"

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState({
    show: false,
    message: "",
    isError: false,
  })
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const collectionsRef = useRef(null)
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = '';
    }
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setSubscribeStatus({
        show: true,
        message: "Please enter your email address",
        isError: true,
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const { data } = await apiClient.post('/subscribers', { email })
      
      setSubscribeStatus({
        show: true,
        message: data.message || 'Thank you for subscribing!',
        isError: false,
      })
      
      setEmail("")
      
      // Hide the success message after 5 seconds
      setTimeout(() => {
        setSubscribeStatus({
          show: false,
          message: "",
          isError: false,
        })
      }, 5000)
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus({
        show: true,
        message: error.response?.data?.message || "Something went wrong. Please try again.",
        isError: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch products and categories in parallel
        const [topProductsData, newProductsData, categoriesData] = await Promise.all([
          getTopProducts(),
          getNewProducts(),
          getProductCategories()
        ]);
        
        setFeaturedProducts(topProductsData);
        setNewArrivals(newProductsData);
        
        // Process and set categories with multiple fallback options
        if (categoriesData && Array.isArray(categoriesData)) {
          const processedCategories = categoriesData.map(category => {
            // Define category-specific fallbacks
            const fallbackImages = {
              dc: "https://m.media-amazon.com/images/I/81j5XT1+IwL._AC_UX679_.jpg",
              marvel: "https://m.media-amazon.com/images/I/71P5CeqBAgS._AC_UX679_.jpg",
              anime: "https://m.media-amazon.com/images/I/71SgfHQm+uL._AC_UX679_.jpg"
            };
            
            // Use category-specific fallback or general fallback
            const fallbackImage = fallbackImages[category.slug] || "/placeholder.svg";
            
            return {
              id: category._id,
              name: category.name.charAt(0).toUpperCase() + category.name.slice(1), // Capitalize first letter
              slug: category.slug,
              count: category.count || 0,
              image: category.image || fallbackImage
            };
          });
          setCategories(processedCategories);
          console.log("Processed categories:", processedCategories); // For debugging
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Hero Section - Sagacity Style */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://i.ytimg.com/vi/n3BZGtMWSDE/maxresdefault.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 transition-transform duration-700 ease-in-out">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wider">
              Exclusive Fashion Collection
            </h1>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12">
            Discover our curated selection of premium apparel designed for the modern fashion enthusiast
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/products" className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-none transform hover:translate-y-[-5px] transition-all duration-300 flex items-center justify-center shadow-lg uppercase tracking-wider">
              <span className="mr-2">Shop Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              to="/products?isNew=true"
              className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium rounded-none transform hover:translate-y-[-5px] transition-all duration-300 flex items-center justify-center shadow-lg border border-white/30 uppercase tracking-wider"
            >
              <span className="mr-2">New Arrivals</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Sagacity Style */}
      <section className="py-20 relative z-10 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
              Collections
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6 animate-scaleIn"></div>
            <p className="text-gray-400 max-w-2xl mx-auto animate-fadeIn">
              Explore our collections from your favorite designers
            </p>
          </div>

          {/* Categories grid with auto-scroll */}
          <div className="relative">
            {/* Gradient overlays for scroll effect */}
            <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
            
            <div className="overflow-hidden" ref={collectionsRef}>
              {isLoading ? (
                <div className="flex gap-6 py-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="relative h-80 w-[300px] flex-shrink-0 bg-neutral-900 animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex collections-scroll-container gap-6 py-4">
                  {/* First set of cards */}
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.slug}`}
                      className="group relative h-80 w-[300px] flex-shrink-0 overflow-hidden transform transition-all duration-500 rounded-lg border border-transparent hover:border-amber-500/30 shadow-lg hover:shadow-amber-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 opacity-100 group-hover:opacity-80 transition-opacity duration-500"></div>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                        onError={(e) => {
                          // Multiple fallback options if image fails to load
                          e.target.onerror = null; 
                          if (category.slug === 'dc') {
                            e.target.src = "https://m.media-amazon.com/images/I/81j5XT1+IwL._AC_UX679_.jpg";
                          } else if (category.slug === 'marvel') {
                            e.target.src = "https://m.media-amazon.com/images/I/71P5CeqBAgS._AC_UX679_.jpg";
                          } else if (category.slug === 'anime') {
                            e.target.src = "https://m.media-amazon.com/images/I/71SgfHQm+uL._AC_UX679_.jpg";
                          } else {
                            e.target.src = "/placeholder.svg";
                          }
                        }}
                      />
                      
                      {/* Floating particles effect on hover */}
                      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="h-0.5 w-12 bg-amber-500 mx-auto mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-pulse"></div>
                        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wider group-hover:text-amber-300 transition-colors duration-300">{category.name}</h3>
                        <p className="text-gray-300 text-sm mb-4 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">{category.count} Products</p>
                        
                        {/* Enhanced button with shine effect */}
                        <span className="inline-block px-4 py-2 border border-white/30 text-sm text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 relative overflow-hidden group-hover:border-amber-500/50 group-hover:text-amber-300 hover:bg-white/5">
                          <span className="relative z-10">View Collection</span>
                          <span className="shine-effect"></span>
                        </span>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Duplicate cards for seamless infinite scroll effect */}
                  {categories.length > 0 && categories.slice(0, 3).map((category) => (
                    <Link
                      key={`duplicate-${category.id}`}
                      to={`/products?category=${category.slug}`}
                      className="group relative h-80 w-[300px] flex-shrink-0 overflow-hidden transform transition-all duration-500 rounded-lg border border-transparent hover:border-amber-500/30 shadow-lg hover:shadow-amber-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 opacity-100 group-hover:opacity-80 transition-opacity duration-500"></div>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                      />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="h-0.5 w-12 bg-amber-500 mx-auto mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wider">{category.name}</h3>
                        <p className="text-gray-300 text-sm mb-4">{category.count} Products</p>
                        <span className="inline-block px-4 py-2 border border-white/30 text-sm text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500">View Collection</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Sagacity Style */}
      <section className="py-20 relative z-10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
              Featured Products
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our selection of premium apparel loved by fashion enthusiasts
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-neutral-900 animate-pulse h-96">
                  <div className="h-72 bg-neutral-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-neutral-700 to-neutral-800"></div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-800 rounded-full w-2/3"></div>
                    <div className="h-4 bg-neutral-800 rounded-full w-1/2"></div>
                    <div className="h-6 bg-neutral-800 rounded-full w-1/4 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product._id || product.id} 
                  product={product} 
                  sagacityStyle={true} 
                />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/products" className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-medium uppercase tracking-wider border-none rounded-none transform hover:translate-y-[-5px] transition-all duration-300 inline-flex items-center">
              <span className="mr-2">View All Products</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Sagacity Style */}
      <section className="py-20 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-neutral-900 p-12 md:p-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                  Subscribe to our Newsletter
                </h2>
                <div className="h-0.5 w-24 bg-amber-500 mb-6"></div>
                <p className="text-gray-300 mb-8">
                  Be the first to know about new collections and exclusive offers
                </p>
                <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
                  <div className="relative flex-grow">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full bg-black border border-neutral-700 focus:border-amber-500 text-white py-3 px-4 placeholder-neutral-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium uppercase tracking-wider border-none transition-all duration-300 inline-flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </form>
                {subscribeStatus.show && (
                  <div className={`mt-4 p-3 ${
                    subscribeStatus.isError 
                      ? "bg-red-900/50 text-red-200 border border-red-700/50" 
                      : "bg-green-900/50 text-green-200 border border-green-700/50"
                  }`}>
                    <div className="flex items-start">
                      {subscribeStatus.isError ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <p>{subscribeStatus.message}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden md:flex items-center justify-center">
                <video 
                  src="/images/Untitled_design.webm" 
                  autoPlay 
                  muted 
                  loop 
                  className="w-auto h-80 rounded-md shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Sagacity Style */}
      <section className="py-16 relative z-10 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 text-center border-r border-neutral-800">
              <div className="w-12 h-12 mx-auto mb-6 text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-4 uppercase tracking-wider">Premium Quality</h3>
              <p className="text-gray-400 text-sm">
                Our apparel is crafted from premium materials designed for comfort, durability and style.
              </p>
            </div>

            <div className="p-8 text-center border-r border-neutral-800">
              <div className="w-12 h-12 mx-auto mb-6 text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-4 uppercase tracking-wider">Free Shipping</h3>
              <p className="text-gray-400 text-sm">
                Complimentary shipping on all orders over $199. Fast delivery to your doorstep.
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-6 text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-4 uppercase tracking-wider">Easy Returns</h3>
              <p className="text-gray-400 text-sm">
                Hassle-free returns within 7 days for unworn items with original packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .transition-transform {
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }
        
        /* Auto scroll animation for collections */
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-300px * 6 - 6rem)); }
        }
        
        .collections-scroll-container {
          animation: scrollX 60s linear infinite;
        }
        
        .collections-scroll-container:hover {
          animation-play-state: paused;
        }
        
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(245, 158, 11, 0.5);
          pointer-events: none;
        }
        
        .particle-1 {
          top: 20%;
          left: 20%;
          animation: float 4s ease-in-out infinite;
        }
        
        .particle-2 {
          top: 60%;
          left: 80%;
          animation: float 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .particle-3 {
          top: 80%;
          left: 40%;
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
          100% { transform: translate(0, 0); }
        }
        
        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shine 2s infinite;
          animation-play-state: paused;
        }
        
        .group:hover .shine-effect {
          animation-play-state: running;
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Smooth scrolling and performance optimizations */
        img {
          will-change: transform;
          transform: translateZ(0);
        }
        
        @media only screen and (max-width: 768px) {
          section.min-h-[90vh] {
            background-size: contain;
            background-position: center;
          }
          
          .collections-scroll-container {
            animation: scrollX 40s linear infinite;
          }
        }
        
        /* Optimize rendering performance */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  )
}

export default HomePage
