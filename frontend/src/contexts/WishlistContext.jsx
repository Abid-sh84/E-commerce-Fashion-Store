"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "../api/user"
import { useAuth } from "./AuthContext"

// Create context with a default value
const WishlistContext = createContext({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
  isLoading: false,
  error: null,
});

// Export the hook separately from the provider component
export const useWishlist = () => useContext(WishlistContext);

// Define the provider component separately from the hook
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  // Fetch wishlist from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistFromApi()
    } else {
      // If not authenticated, load from localStorage
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    }
  }, [isAuthenticated])

  // Save wishlist to localStorage when items change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const fetchWishlistFromApi = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getWishlist()
      setWishlistItems(data)
    } catch (err) {
      console.error("Error fetching wishlist:", err)
      setError(err.message || "Failed to fetch wishlist")
      // Fallback to localStorage if API fails
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (product) => {
    // Check if item already exists in wishlist
    const exists = wishlistItems.some(
      (item) => 
        item.id != null && product.id != null && 
        String(item.id) === String(product.id)
    )

    if (exists) return // Already in wishlist

    try {
      // Update UI immediately for better user experience
      setWishlistItems((prev) => [...prev, product])
      
      if (isAuthenticated) {
        // Sync with backend if authenticated
        await apiAddToWishlist(product._id || product.id)
        // Refresh wishlist from API
        fetchWishlistFromApi()
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err)
      // Revert UI change on error
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id))
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      // Update UI immediately
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId && item._id !== productId))
      
      if (isAuthenticated) {
        // Sync with backend if authenticated
        await apiRemoveFromWishlist(productId)
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err)
      // No need to revert UI as user intends to remove anyway
    }
  }

  // Safe comparison of IDs handling undefined values
  const isInWishlist = (productId) => {
    if (productId == null) return false
    
    const productIdStr = String(productId)
    
    return wishlistItems.some((item) => {
      const itemId = item._id || item.id
      return itemId != null && String(itemId) === productIdStr
    })
  }

  const clearWishlist = async () => {
    setWishlistItems([])
    localStorage.setItem("wishlist", JSON.stringify([]))
    
    // Additional API call to clear all wishlist items could be added here
    // if your backend supports such an operation
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isLoading,
    error,
    refresh: fetchWishlistFromApi
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
