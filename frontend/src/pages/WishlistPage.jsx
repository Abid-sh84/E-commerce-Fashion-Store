"use client"
import { Link } from "react-router-dom"
import { useWishlist } from "../contexts/WishlistContext"
import { useCart } from "../contexts/CartContext"
import { useEffect, useState } from "react"

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [showStars, setShowStars] = useState(false) // Disabled by default now

  // We'll keep this effect but it will be disabled by default now
  useEffect(() => {
    const createStars = () => {
      if (!showStars) return;
      
      const starsContainer = document.getElementById('stars-container');
      if (!starsContainer) return;
      
      // Clear previous stars
      starsContainer.innerHTML = '';
      
      // Create new stars
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
      }
    };

    createStars();
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, [showStars]);

  const handleRemoveItem = (id) => {
    removeFromWishlist(id)
  }

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: "M"
    })
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-dvh bg-neutral-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl font-bold text-center text-white mb-4 uppercase tracking-wider">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Wishlist</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-center text-gray-400 mb-12">Save your favorites for later</p>

          <div className="bg-neutral-900 rounded-lg p-8 text-center border border-neutral-800 shadow-lg">
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Your wishlist is empty!</h2>
            <p className="text-gray-400 mb-8">Add your favorite items to save them for later.</p>
            <Link to="/products" className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wider">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Wishlist</span>
            </h1>
            <div className="h-0.5 w-24 bg-amber-500 mb-4"></div>
            <p className="text-gray-400">Items saved for later</p>
          </div>
          <button 
            onClick={clearWishlist} 
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center space-x-2 transition-colors border border-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group">
              <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 transition-all duration-300 hover:border-amber-600">
                <div className="relative">
                  <Link to={`/products/${item.id}`}>
                    <div className="relative overflow-hidden h-64">
                      <img
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60"></div>
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-3 right-3 bg-neutral-800/80 hover:bg-neutral-700 p-2 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400 hover:text-red-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-5">
                  <Link to={`/products/${item.id}`} className="block mb-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-amber-500 transition-colors">{item.name}</h3>
                  </Link>

                  {item.universe && (
                    <span className="inline-block text-xs font-medium bg-neutral-800 text-gray-300 px-3 py-1 rounded-full">
                      {item.universe}
                    </span>
                  )}

                  <div className="flex items-center mt-4">
                    <div className="flex text-amber-500">
                      {Array(5).fill(null).map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < (item.rating || 4) ? 'text-amber-500' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-xs text-gray-400">({item.reviewCount || 0})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      {item.discount > 0 ? (
                        <div className="flex items-center">
                          <span className="font-bold text-lg text-amber-500">
                            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-gray-500 line-through ml-2 text-sm">${item.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-lg text-amber-500">${item.price?.toFixed(2) || "29.99"}</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full mt-4 bg-amber-700 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products" className="inline-flex items-center px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WishlistPage