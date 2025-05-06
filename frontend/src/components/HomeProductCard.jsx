import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const HomeProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Update isWishlisted when product changes or wishlist changes
  useEffect(() => {
    if (product && product.id) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product, isInWishlist, wishlistItems]);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      selectedSize: product.sizes?.[0] || "M",
      quantity: 1,
    });
  };

  // Calculate discounted price
  const discountedPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2) 
    : null;

  return (
    <div 
      className="relative group overflow-hidden h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cosmic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-yellow-600/30 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-md rounded-lg overflow-hidden border border-indigo-700/50 shadow-lg shadow-purple-900/30 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1 group-hover:border-yellow-500/30 h-full flex flex-col">
        {/* Product Link and Image */}
        <Link to={`/product/${product.id}`} className="block flex-grow">
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/cosmic-bg.jpg')] bg-cover bg-center opacity-10"></div>
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter group-hover:brightness-110"
            />
            
            {/* Badges with animation */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <div className="bg-yellow-400 text-indigo-950 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3 flex items-center">
                  <span className="mr-1">✦</span> NEW
                </div>
              )}
              {product.discount > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform transition-transform group-hover:scale-110 group-hover:-rotate-3 flex items-center">
                  <span className="mr-1">⚡</span> {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Quick action buttons - appear on hover */}
            <div className={`absolute right-3 transition-all duration-300 flex flex-col gap-2 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <button
                onClick={handleAddToCart}
                className="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                title="Add to Cart"
                disabled={product.countInStock === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${
                  isWishlisted 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white text-indigo-950 hover:bg-gray-100'
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {isWishlisted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </Link>
        
        {/* Product Info with cosmic styling */}
        <div className="p-5 flex flex-col justify-between relative">
          {/* Stars background effect */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute h-1 w-1 bg-white rounded-full top-3 left-5 animate-pulse"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-6 left-20 animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-16 left-12 animate-pulse" style={{animationDelay: '0.7s'}}></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-12 left-28 animate-pulse" style={{animationDelay: '1.1s'}}></div>
          </div>

          {/* Universe/Category Tag */}
          {product.universe && (
            <span className="inline-block px-2 py-1 bg-indigo-800/70 text-xs rounded-full text-indigo-300 mb-2 font-medium group-hover:bg-indigo-700/70 group-hover:text-yellow-300 transition-colors">
              {product.universe}
            </span>
          )}
          
          {/* Product Name */}
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-500/50"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-xs text-indigo-300 group-hover:text-indigo-200 transition-colors">
                ({product.reviewCount || 0})
              </span>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex justify-between items-end mt-auto">
            <div className="flex flex-col">
              {discountedPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors">${discountedPrice}</span>
                  <span className="text-sm text-indigo-400 line-through">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            {/* View Details Button */}
            <Link 
              to={`/product/${product.id}`}
              className="text-xs uppercase tracking-wide font-bold text-indigo-300 group-hover:text-yellow-300 transition-colors flex items-center"
            >
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProductCard;
