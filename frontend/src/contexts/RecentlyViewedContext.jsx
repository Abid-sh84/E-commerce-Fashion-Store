"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create context
const RecentlyViewedContext = createContext({
  recentlyViewedItems: [],
  addRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
  isLoading: false
});

// Export the hook separately
export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

// Define the provider component
export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([])
  
  // Load recently viewed items from localStorage on initial render
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const saved = localStorage.getItem('recentlyViewed')
        if (saved) {
          setRecentlyViewedItems(JSON.parse(saved))
        }
      } catch (error) {
        console.error("Error loading recently viewed items:", error)
      }
    }

    loadRecentlyViewed()
  }, [])

  // Function to add a product to recently viewed
  const addRecentlyViewed = async (product) => {
    if (!product || !product.id) return

    try {
      // Get existing items
      const saved = localStorage.getItem('recentlyViewed')
      let items = saved ? JSON.parse(saved) : []
      
      // Remove the product if it already exists to avoid duplicates
      items = items.filter(item => String(item.id) !== String(product.id))
      
      // Add the product to the beginning of the array with current timestamp
      items.unshift({
        ...product,
        viewedAt: new Date().toISOString()
      })
      
      // Limit the number of items
      if (items.length > 10) {
        items = items.slice(0, 10)
      }
      
      // Save back to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(items))
      
      // Update state
      setRecentlyViewedItems(items)
    } catch (error) {
      console.error("Error adding recently viewed product:", error)
    }
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewedItems([])
    localStorage.setItem('recentlyViewed', JSON.stringify([]))
  }
  
  const value = {
    recentlyViewedItems,
    addRecentlyViewed,
    clearRecentlyViewed
  }
  
  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}