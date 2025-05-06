"use client"

import { useState, useEffect, lazy, Suspense, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useWishlist } from "../contexts/WishlistContext"
import { useRecentlyViewed } from "../contexts/RecentlyViewedContext"
import { useAuth } from "../contexts/AuthContext" 
import { 
  getProductById, 
  getProductsByCategory,
  createReview,
  updateReview,
  deleteReview,
  getReviews
} from "../api/products" 
import { validateReviewData } from "../utils/validation"

// Use lazy loading for ProductCard components
const ProductCard = lazy(() => import("../components/ProductCard"))
const RecentlyViewedProducts = lazy(() => import("../components/RecentlyViewedProducts"))

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addRecentlyViewed } = useRecentlyViewed()
  const { user, isAuthenticated } = useAuth() 

  // Add refs for magnifier functionality
  const imageContainerRef = useRef(null)
  
  // Add refs for the review form fields
  const reviewTitleRef = useRef(null);
  const reviewTextRef = useRef(null);
  
  // Add state variables for magnifier
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [magnifierSize] = useState(150) // Size of the magnifier
  const [zoomLevel] = useState(2.5) // Zoom level
  
  // Add state for separate zoom box
  const [showZoomBox, setShowZoomBox] = useState(false)

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([]) // Added state for related products
  
  // Add state for review management
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");
  
  const sizes = ["S", "M", "L", "XL", "XXL"];
  
  // Add a helper function to check if current user is the author of a review
  const isReviewAuthor = (review) => {
    if (!isAuthenticated || !user || !review || !review.user) {
      return false;
    }
    
    // Try different comparison methods to ensure compatibility
    try {
      // Convert both to strings for comparison
      const reviewUserId = typeof review.user === 'object' ? review.user.toString() : String(review.user);
      const currentUserId = typeof user._id === 'object' ? user._id.toString() : String(user._id);
      
      console.log('Comparing review user:', reviewUserId, 'with current user:', currentUserId);
      
      return reviewUserId === currentUserId;
    } catch (err) {
      console.error('Error comparing user IDs:', err);
      return false;
    }
  };

  // Add fetchReviews function
  const fetchReviews = async () => {
    try {
      if (!id) {
        console.warn("Cannot fetch reviews: Product ID is missing");
        return;
      }
      
      console.log(`Fetching reviews for product ID: ${id}`);
      const reviewsData = await getReviews(id);
      
      if (Array.isArray(reviewsData)) {
        console.log(`Received ${reviewsData.length} reviews`);
        // Debug: Log the first review to check its structure
        if (reviewsData.length > 0) {
          console.log("First review structure:", reviewsData[0]);
          console.log("Review user ID type:", typeof reviewsData[0].user);
          console.log("Review user ID value:", reviewsData[0].user);
        }
        
        // Debug: Log current user info
        if (user) {
          console.log("Current user ID type:", typeof user._id);
          console.log("Current user ID value:", user._id);
        }
        
        setReviews(reviewsData);
        
        // Check if the logged-in user already has a review
        if (isAuthenticated && user) {
          const existingReview = reviewsData.find(
            (review) => review.user && String(review.user) === String(user._id)
          );
          if (existingReview) {
            console.log("Found user's review:", existingReview);
            setUserReview(existingReview);
          } else {
            setUserReview(null);
          }
        }
      } else {
        console.warn("Received invalid reviews data:", reviewsData);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      // Don't show error to user, just provide empty reviews
    }
  };

  // Add handleDeleteReview function
  const handleDeleteReview = async (reviewId) => {
    if (!reviewId || !isAuthenticated) return;
    
    setIsDeleting(true);
    try {
      // Pass user ID to backend to verify ownership
      await deleteReview(id, reviewId);
      
      // Refresh product and reviews data after deletion
      const updatedProduct = await getProductById(id);
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
      
      await fetchReviews();
      setUserReview(null); // Reset user review after deletion
      
      setActionSuccess("Review deleted successfully");
      // Clear success message after 3 seconds
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete review. Please try again.";
      setReviewError(errorMessage);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  };
  
  // Enhance handleEditReview function with error handling
  const handleEditReview = () => {
    if (!userReview || !isAuthenticated) return;
    
    try {
      // Set up form with current review data
      setReviewRating(userReview.rating || 5);
      setReviewTitle(userReview.title || "");
      setReviewText(userReview.comment || "");
      setIsEditMode(true);
      setShowReviewForm(true);
      
      // Scroll to the review form
      setTimeout(() => {
        document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Error preparing review edit:", error);
      setReviewError("Failed to prepare review for editing. Please try again.");
    }
  };

  // Fix the handleReviewSubmit function
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setReviewError("You must be logged in to submit a review");
      return;
    }

    try {
      setIsSubmittingReview(true);
      setReviewError("");

      if (!reviewRating || !reviewTitle.trim() || !reviewText.trim()) {
        setReviewError("Please fill out all review fields");
        setIsSubmittingReview(false);
        return;
      }

      const reviewData = {
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewText.trim(),
      };
      
      // Validate review data
      const { isValid, error } = validateReviewData(reviewData);
      if (!isValid) {
        setReviewError(error);
        setIsSubmittingReview(false);
        return;
      }

      console.log(`Submitting review for product ID: ${id}`, reviewData);

      let result;
      if (isEditMode && userReview) {
        // Update existing review
        result = await updateReview(id, userReview._id, reviewData);
      } else {
        // Create new review
        result = await createReview(id, reviewData);
      }

      console.log("Review submission successful:", result);

      // Refresh product and reviews data
      const updatedProduct = await getProductById(id);
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
      
      await fetchReviews();
      
      // Reset form
      setShowReviewForm(false);
      setReviewRating(5);
      setReviewTitle("");
      setReviewText("");
      setIsEditMode(false);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review. Please try again.";
      setReviewError(errorMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  // Mouse handlers for magnifier effect
  const handleMouseEnter = () => {
    setShowMagnifier(true);
    setShowZoomBox(true);
  };
  
  const handleMouseLeave = () => {
    setShowMagnifier(false);
    setShowZoomBox(false);
  };
  
  const handleMouseMove = (e) => {
    if (imageContainerRef.current) {
      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      
      setCursorPosition({ x, y });
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }

    // Add product to cart with selected options
    addToCart({
      ...product,
      selectedSize,
      quantity,
      // Make sure we're passing the MongoDB _id along with the product
      _id: product._id || product.id
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  // Optimize product fetching with better error handling
  useEffect(() => {
    let isMounted = true; // Track component mount state

    // Helper function to fetch related products
    const fetchRelatedProducts = async (category) => {
      if (!category || !isMounted) return;
      
      try {
        const relatedData = await getProductsByCategory(category);
        
        if (!isMounted) return;
        
        if (relatedData && relatedData.length > 0) {
          const relatedFiltered = relatedData.filter(p => {
            return String(p._id) !== String(id);
          }).slice(0, 4);
          setRelatedProducts(relatedFiltered);
        }
      } catch (relatedErr) {
        console.warn('Could not load related products:', relatedErr);
        if (isMounted) {
          setRelatedProducts([]);
        }
      }
    };

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          console.error('Product ID is missing from URL params');
          setError("Invalid product ID");
          setIsLoading(false);
          return;
        }
        
        console.log(`Loading product with ID: ${id}`);
        
        // Check if product exists in local storage first
        const storedProduct = localStorage.getItem(`product_${id}`);
        if (storedProduct) {
          console.log('Product loaded from local storage');
          const parsedProduct = JSON.parse(storedProduct);
          if (!isMounted) return;
          setProduct(parsedProduct);
          
          // Add to recently viewed even if loaded from cache
          if (parsedProduct._id || parsedProduct.id) {
            addRecentlyViewed(parsedProduct);
          }
          
          // Set other states based on cached product
          if (parsedProduct.sizes && parsedProduct.sizes.length > 0) {
            setSelectedSize(parsedProduct.sizes[0]);
          }
          
          if (typeof isInWishlist === 'function') {
            const productId = parsedProduct._id || parsedProduct.id;
            setIsWishlisted(isInWishlist(productId));
          }
          
          setIsLoading(false);
          
          // Fetch related products based on the stored product's category
          fetchRelatedProducts(parsedProduct.category);
          
          // Still fetch in background to get updated data
          getProductById(id).then(freshProduct => {
            if (freshProduct && isMounted) {
              // Update local storage with fresh data
              localStorage.setItem(`product_${id}`, JSON.stringify(freshProduct));
              setProduct(freshProduct);
            }
          }).catch(err => console.warn('Background refresh failed:', err));
          
          return; // Exit early since we loaded from cache
        }
        
        try {
          const apiProduct = await getProductById(id);
          
          // Check if component is still mounted before updating state
          if (!isMounted) return;
          
          if (apiProduct) {
            console.log('Product loaded successfully:', apiProduct.name);
            
            // Store product in local storage for future visits
            localStorage.setItem(`product_${id}`, JSON.stringify(apiProduct));
            
            setProduct(apiProduct);
            
            // Add to recently viewed products list in local storage
            if (apiProduct._id || apiProduct.id) {
              addRecentlyViewed(apiProduct);
            }
            
            // Default to first available size if there are sizes
            if (apiProduct.sizes && apiProduct.sizes.length > 0) {
              setSelectedSize(apiProduct.sizes[0]);
            }
            
            // Check if item is in wishlist - safely check if function exists first
            if (typeof isInWishlist === 'function') {
              const productId = apiProduct._id || apiProduct.id;
              setIsWishlisted(isInWishlist(productId));
            }
            
            setIsLoading(false);
            
            // Fetch related products based on category
            fetchRelatedProducts(apiProduct.category);
          } else {
            if (isMounted) {
              setError("Product not found");
              setIsLoading(false);
            }
          }
        } catch (apiError) {
          console.error('API product fetch failed:', apiError.message);
          if (isMounted) {
            setError("Failed to load product");
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Unexpected error in fetchProduct:', err);
        if (isMounted) {
          setError("Failed to load product");
          setIsLoading(false);
        }
      }
    };
    
    fetchProduct();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
    // Only depend on id, not on functions like isInWishlist that change on each render
  }, [id, addRecentlyViewed]);

  // Add useEffect to fetch reviews when product is loaded
  useEffect(() => {
    if (product && id) {
      fetchReviews();
    }
  }, [product, id]);

  // Modified ReviewForm component
  const ReviewForm = () => {
    // Use local component state to manage input values and maintain focus
    const [localTitle, setLocalTitle] = useState(reviewTitle);
    const [localText, setLocalText] = useState(reviewText);
    
    // Sync local state with parent state when parent state changes
    useEffect(() => {
      setLocalTitle(reviewTitle);
      setLocalText(reviewText);
    }, [reviewTitle, reviewText]);
    
    // Handle form submission with local state values
    const handleSubmit = (e) => {
      e.preventDefault();
      // Update parent state before submitting
      setReviewTitle(localTitle);
      setReviewText(localText);
      // Call the existing submit handler
      handleReviewSubmit(e);
    };
    
    return (
      <form id="review-form" onSubmit={handleSubmit} className="bg-neutral-800 p-6 border border-neutral-700 mb-6">
        <h4 className="font-medium text-white text-lg mb-4 uppercase tracking-wider">
          {isEditMode ? "Update Your Review" : "Write a Review"}
        </h4>
        
        {reviewError && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 p-3 mb-4 rounded">
            {reviewError}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 ${
                    reviewRating >= star ? "text-amber-500" : "text-gray-600"
                  } hover:text-amber-400 transition-colors`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="reviewTitle" className="block text-gray-300 mb-2">
            Title
          </label>
          <input
            ref={reviewTitleRef}
            type="text"
            id="reviewTitle"
            className="w-full bg-neutral-700 border border-neutral-600 text-white px-4 py-2 rounded focus:outline-none focus:border-amber-500"
            placeholder="Give your review a title"
            required
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            style={{ textAlign: 'left', direction: 'ltr' }}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="reviewText" className="block text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            ref={reviewTextRef}
            id="reviewText"
            className="w-full bg-neutral-700 border border-neutral-600 text-white px-4 py-2 rounded focus:outline-none focus:border-amber-500 h-32"
            placeholder="Share your experience with this product..."
            required
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            style={{ textAlign: 'left', direction: 'ltr' }}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={() => {
              setShowReviewForm(false);
              setIsEditMode(false);
              setReviewTitle("");
              setReviewText("");
              setReviewRating(5);
            }}
            className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-bold uppercase tracking-wider transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-wider transition-all flex items-center"
          >
            {isSubmittingReview && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isEditMode ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </form>
    );
  };

  // Enhanced loading state with simplified styling
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="animate-pulse">
            {/* ...existing loading state code... */}
          </div>
        </div>
      </div>
    );
  }

  // Error state with simplified theme
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="bg-neutral-900 p-8 border border-neutral-800 text-center max-w-md">
          {/* ...existing error state code... */}
        </div>
      </div>
    );
  }

  // Main component rendering with simplified theme
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Success message toast */}
        {actionSuccess && (
          <div className="fixed top-20 right-4 z-50 bg-green-900/90 border border-green-700 text-green-100 px-4 py-3 rounded-md shadow-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>{actionSuccess}</p>
            </div>
          </div>
        )}
        
        {/* Confirmation dialog for deleting review */}
        {confirmDeleteId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 max-w-md mx-4">
              <h3 className="text-xl font-medium text-white mb-4">Delete Review</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to delete your review? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded transition-all"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReview(confirmDeleteId)}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-medium rounded transition-all flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li>
              <Link to="/" className="hover:text-amber-500 transition-colors uppercase tracking-wider">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link to="/products" className="hover:text-amber-500 transition-colors uppercase tracking-wider">
                Products
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-amber-500 font-medium uppercase tracking-wider">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images with styling */}
          <div className="space-y-4">
            {/* Product image with zoom feature */}
            <div className="flex gap-4 relative">
              {/* Magnifier container */}
              <div 
                ref={imageContainerRef}
                className="bg-neutral-900 overflow-hidden border border-neutral-800 relative group cursor-crosshair flex-1"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                {/* Badge overlays */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <div className="bg-black text-white text-xs font-bold px-3 py-1 uppercase">
                      New
                    </div>
                  )}
                  {product.discount > 0 && (
                    <div className="bg-amber-700 text-white text-xs font-bold px-3 py-1 uppercase">
                      Sale
                    </div>
                  )}
                </div>
                
                {/* Main image */}
                <div className="relative overflow-hidden" style={{ height: '480px' }}>
                  <img
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="eager" // Load main image immediately
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent opacity-50 pointer-events-none"></div>
                </div>
                
                {/* Magnifier element for hover spot */}
                {showMagnifier && (
                  <div 
                    className="absolute pointer-events-none border-2 border-amber-500 shadow-lg z-20"
                    style={{
                      width: `${magnifierSize}px`,
                      height: `${magnifierSize}px`,
                      borderRadius: '50%',
                      // Position the magnifier based on cursor, accounting for its size
                      left: `calc(${cursorPosition.x}% - ${magnifierSize / 2}px)`,
                      top: `calc(${cursorPosition.y}% - ${magnifierSize / 2}px)`,
                      backgroundImage: `url(${product.images[selectedImage] || "/placeholder.svg"})`,
                      backgroundPosition: `calc(${cursorPosition.x * zoomLevel}% - ${cursorPosition.x}%) calc(${cursorPosition.y * zoomLevel}% - ${cursorPosition.y}%)`,
                      backgroundSize: `${zoomLevel * 100}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}
              </div>
              
              {/* Separate zoom box to the right of the image */}
              {showZoomBox && (
                <div 
                  className="hidden md:block bg-neutral-900 border-2 border-amber-600 absolute top-0 left-full ml-4 z-30 shadow-xl"
                  style={{
                    width: '400px',
                    height: '400px',
                    backgroundImage: `url(${product.images[selectedImage] || "/placeholder.svg"})`,
                    backgroundPosition: `calc(${cursorPosition.x * zoomLevel}% - ${cursorPosition.x}%) calc(${cursorPosition.y * zoomLevel}% - ${cursorPosition.y}%)`,
                    backgroundSize: `${zoomLevel * 100}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent opacity-75 pointer-events-none"></div>
                </div>
              )}
            </div>

            {/* Thumbnail navigation with styling */}
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-neutral-900 overflow-hidden border transition-all ${
                    selectedImage === index 
                      ? "border-amber-600" 
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-auto object-cover aspect-square"
                    loading="lazy" // Lazy load thumbnails
                  />
                </button>
              ))}
            </div>
            
            {/* Instruction text for zoom feature */}
            <div className="text-center text-gray-400 text-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Hover over image to zoom
            </div>
          </div>

          {/* Product Info with styling */}
          <div className="bg-neutral-900 p-6 border border-neutral-800">
            {product.isNew && (
              <span className="inline-block bg-black text-white text-xs font-bold px-3 py-1 mb-3 uppercase">
                New Arrival
              </span>
            )}

            <h1 className="text-3xl font-bold text-white mb-3 uppercase tracking-wider">
              {product.name}
              <div className="h-1 w-24 bg-amber-600 mt-2"></div>
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${i < product.rating ? "text-amber-500" : "text-gray-600"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-400 ml-2 text-sm">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center bg-neutral-800 p-3 border border-neutral-700">
                  <span className="text-3xl font-bold text-amber-500">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-500 line-through ml-3">${product.price.toFixed(2)}</span>
                  <span className="ml-auto bg-amber-700 text-white text-xs font-bold px-3 py-1">
                    SAVE {product.discount}%
                  </span>
                </div>
              ) : (
                <div className="bg-neutral-800 p-3 border border-neutral-700">
                  <span className="text-3xl font-bold text-amber-500">${product.price.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3 uppercase tracking-wider">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center font-bold transition-all duration-300 ${
                      selectedSize === size
                        ? "bg-amber-700 text-white"
                        : "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize === "" && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please select a size
                </p>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-3 uppercase tracking-wider">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-12 h-12 bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <div className="w-16 h-12 bg-white text-neutral-950 flex items-center justify-center font-bold border-y border-neutral-700">
                  {quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                  className="w-12 h-12 bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Maximum: 10 per order</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold transform hover:translate-y-[-5px] transition-all duration-300 flex-1 flex items-center justify-center uppercase tracking-wider"
                disabled={!selectedSize}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-3 font-bold flex items-center justify-center transition-all duration-300 uppercase tracking-wider ${
                  isWishlisted
                    ? "bg-amber-700 text-white hover:bg-amber-600"
                    : "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-white" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isWishlisted ? 0 : 2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            <div className="bg-neutral-800 p-4 mb-6 border border-neutral-700">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">In stock and ready to ship</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white">Order within 12 hours for same-day dispatch</span>
              </div>
            </div>

            {/* Tabs with styling */}
            <div className="border-t border-neutral-700 pt-6">
              <div className="flex mb-4 border-b border-neutral-700">
                {["description", "details", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-2 px-4 font-medium transition-all uppercase tracking-wider ${
                      activeTab === tab 
                        ? "text-amber-500 border-b-2 border-amber-500" 
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "reviews" && ` (${product.reviewCount})`}
                  </button>
                ))}
              </div>

              <div className="text-gray-300 leading-relaxed">
                {activeTab === "description" && (
                  <p className="animate-fadeIn">
                    {product.description ||
                      "Experience the perfect blend of comfort and style with this premium superhero-themed t-shirt. Made from high-quality materials, this t-shirt features vibrant colors and detailed artwork that won't fade after washing. The breathable fabric ensures all-day comfort, whether you're out with friends or lounging at home."}
                  </p>
                )}

                {activeTab === "details" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <h4 className="font-medium text-white uppercase tracking-wider">Material</h4>
                      <p>60% combed ringspun cotton, 40% polyester jersey</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase tracking-wider">Care Instructions</h4>
                      <p>Machine wash cold with like colors, tumble dry low</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase tracking-wider">Features</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Premium quality print that won't crack or fade</li>
                        <li>Soft and comfortable fabric</li>
                        <li>Reinforced stitching for durability</li>
                        <li>Officially licensed design</li>
                        <li>Unisex fit</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white text-lg uppercase tracking-wider">
                          {product.reviewCount} {product.reviewCount === 1 ? "Review" : "Reviews"}
                        </h4>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${i < product.rating ? "text-amber-500" : "text-gray-600"}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-400 ml-2">{product.rating} out of 5</span>
                        </div>
                      </div>

                      {!showReviewForm && !userReview && (
                        <button 
                          onClick={() => {
                            if (isAuthenticated) {
                              setShowReviewForm(true);
                            }
                          }}
                          className={`px-6 py-2 ${
                            isAuthenticated 
                              ? "bg-amber-700 hover:bg-amber-600 text-white" 
                              : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                          } text-sm font-bold uppercase tracking-wider transition-all`}
                          disabled={!isAuthenticated}
                        >
                          {isAuthenticated ? "Write a Review" : "Sign In to Review"}
                        </button>
                      )}
                    </div>

                    {!isAuthenticated && (
                      <div className="bg-neutral-800 p-4 border border-neutral-700 text-center my-6">
                        <p className="text-gray-300 mb-3">Please sign in to write a review</p>
                        <Link 
                          to="/login" 
                          className="inline-block px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-wider transition-all"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}

                    {showReviewForm && <ReviewForm />}

                    {/* Reviews list - modified to include delete functionality */}
                    <div className="space-y-6">
                      {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review._id} className="bg-neutral-800 p-4 border border-neutral-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className={`h-4 w-4 ${i < review.rating ? "text-amber-500" : "text-gray-600"}`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <h5 className="font-medium text-white ml-2">{review.title}</h5>
                              </div>
                              
                              {/* Edit & Delete buttons - shown only to the review author */}
                              {isReviewAuthor(review) && (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => {
                                      setUserReview(review);
                                      handleEditReview();
                                    }}
                                    className="text-amber-500 hover:text-amber-400 text-sm transition-colors flex items-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(review._id)}
                                    className="text-red-500 hover:text-red-400 text-sm transition-colors flex items-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-400 mb-2">
                              By <span className="text-amber-400">{review.name || "Anonymous"}</span> on {new Date(review.createdAt).toLocaleDateString()}
                              {user && String(review.user) === String(user._id) && (
                                <span className="ml-2 text-amber-500">(Your review)</span>
                              )}
                            </p>
                            <p className="text-gray-300">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-neutral-800 p-6 border border-neutral-700 text-center">
                          <p className="text-gray-400 mb-4">This product has no reviews yet.</p>
                          {isAuthenticated && !userReview && !showReviewForm && (
                            <button
                              onClick={() => setShowReviewForm(true)}
                              className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-wider transition-all"
                            >
                              Be the first to review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products with styling */}
        <div className="mt-16 relative">
          {/* Decorative element */}
          <div className="h-0.5 w-16 bg-amber-600 mb-5"></div>
          
          <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider">You May Also Like</h2>

          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-neutral-900 h-64 border border-neutral-800 animate-pulse"></div>
              ))}
            </div>
          }>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} sagacityStyle={true} />
              ))}
            </div>
          </Suspense>
        </div>

        {/* Recently Viewed Products Section */}
        <div className="mt-16">
          <Suspense fallback={<div>Loading recently viewed products...</div>}>
            <RecentlyViewedProducts currentProductId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// Add a helper function to check if current user is the author of a review
  const isReviewAuthor = (review) => {
    if (!isAuthenticated || !user || !review || !review.user) {
      return false;
    }
    
    // Try different comparison methods to ensure compatibility
    try {
      // Convert both to strings for comparison
      const reviewUserId = typeof review.user === 'object' ? review.user.toString() : String(review.user);
      const currentUserId = typeof user._id === 'object' ? user._id.toString() : String(user._id);
      
      console.log('Comparing review user:', reviewUserId, 'with current user:', currentUserId);
      
      return reviewUserId === currentUserId;
    } catch (err) {
      console.error('Error comparing user IDs:', err);
      return false;
    }
  };

export default ProductDetailPage
