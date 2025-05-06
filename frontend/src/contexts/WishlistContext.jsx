"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create context with a default value
const WishlistContext = createContext({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
});

// Export the hook separately from the provider component
export const useWishlist = () => useContext(WishlistContext);

// Define the provider component separately from the hook
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  useEffect(() => {
    // Save wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      // Check if item already exists in wishlist
      const exists = prevItems.some((item) => 
        item.id != null && product.id != null && 
        String(item.id) === String(product.id)
      )

      if (exists) {
        return prevItems
      } else {
        return [...prevItems, product]
      }
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => {
      return prevItems.filter((item) => item.id !== productId)
    })
  }

  // Fixed function to safely compare IDs by handling undefined values
  const isInWishlist = (productId) => {
    if (productId == null) return false; // Handle null or undefined productId
    
    const productIdStr = String(productId); // Use String() instead of toString() for safety
    
    return wishlistItems.some((item) => {
      // Handle case where item.id might be null or undefined
      return item.id != null && String(item.id) === productIdStr;
    });
  }

  // Add clearWishlist function
  const clearWishlist = () => {
    setWishlistItems([]);
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
