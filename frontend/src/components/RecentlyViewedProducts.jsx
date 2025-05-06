import { lazy, Suspense, useState, useEffect } from "react"
import { useRecentlyViewed } from "../contexts/RecentlyViewedContext"

// Use lazy loading for ProductCard components
const ProductCard = lazy(() => import("./ProductCard"))

const RecentlyViewedProducts = ({ currentProductId = null, showClearButton = false }) => {
  const { recentlyViewedItems, clearRecentlyViewed } = useRecentlyViewed()
  const [localProducts, setLocalProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Function to remove a single product from recently viewed
  const handleRemoveProduct = (product) => {
    try {
      const productId = product._id || product.id;
      if (!productId) return;
      
      // Remove from local storage
      localStorage.removeItem(`product_${productId}`);
      
      // Remove from local state
      setLocalProducts(prevProducts => 
        prevProducts.filter(p => {
          const pId = p._id || p.id;
          return String(pId) !== String(productId);
        })
      );
    } catch (err) {
      console.error("Error removing individual product:", err);
    }
  };
  
  // Function to clear recently viewed products from local storage
  const handleClearRecentlyViewed = () => {
    try {
      // Get all keys from local storage
      const allKeys = Object.keys(localStorage)
      
      // Filter keys that start with "product_" and remove them
      const productKeys = allKeys.filter(key => key.startsWith('product_'))
      productKeys.forEach(key => localStorage.removeItem(key))
      
      // Clear products from state
      setLocalProducts([])
      
      // Also clear from context if available
      if (typeof clearRecentlyViewed === 'function') {
        clearRecentlyViewed()
      }
    } catch (err) {
      console.error("Error clearing recently viewed products:", err)
    }
  }
  
  // Function to get products from local storage
  useEffect(() => {
    const getProductsFromLocalStorage = () => {
      setIsLoading(true)
      try {
        // Get all keys from local storage
        const allKeys = Object.keys(localStorage)
        
        // Filter keys that start with "product_"
        const productKeys = allKeys.filter(key => key.startsWith('product_'))
        
        // Get products from local storage
        const products = productKeys.map(key => {
          try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
          } catch (err) {
            console.error(`Error parsing product ${key}:`, err)
            return null
          }
        }).filter(Boolean) // Remove null items
        
        // Sort by most recently added (if we had timestamps, we could use those)
        // For now, just assume the order in recentlyViewedItems context is correct
        const orderedProducts = []
        
        // First try to order based on recentlyViewedItems if it exists
        if (recentlyViewedItems && recentlyViewedItems.length > 0) {
          // Create a map of product IDs from local storage
          const productsMap = products.reduce((map, product) => {
            const id = product._id || product.id
            if (id) map[id] = product
            return map
          }, {})
          
          // Add products in the order they appear in recentlyViewedItems
          recentlyViewedItems.forEach(item => {
            const id = item._id || item.id
            if (id && productsMap[id]) {
              orderedProducts.push(productsMap[id])
              // Remove from map to avoid duplicates
              delete productsMap[id]
            }
          })
          
          // Add any remaining products
          Object.values(productsMap).forEach(product => {
            orderedProducts.push(product)
          })
        } else {
          // If no recentlyViewedItems, just use the products as is
          orderedProducts.push(...products)
        }
        
        setLocalProducts(orderedProducts)
      } catch (err) {
        console.error("Error getting products from local storage:", err)
        setLocalProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    
    getProductsFromLocalStorage()
  }, [recentlyViewedItems])
  
  // Filter out the current product (if any) and only show up to 4 items
  const filteredItems = currentProductId 
    ? localProducts
        .filter(item => {
          const itemId = item._id || item.id
          return String(itemId) !== String(currentProductId)
        })
        .slice(0, 4)
    : localProducts.slice(0, 4) // If no currentProductId, just take the first 4 items
  
  // Loading state
  if (isLoading) {
    return (
      <div className="mt-16 relative">
        <div className="h-0.5 w-16 bg-amber-600 mb-5"></div>
        <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-900 h-64 border border-neutral-800 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }
  
  if (filteredItems.length === 0) {
    return null
  }
  
  return (
    <div className="mt-16 relative">
      {/* Decorative element */}
      <div className="h-0.5 w-16 bg-amber-600 mb-5"></div>
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Recently Viewed</h2>
        
        {showClearButton && (
          <button 
            onClick={handleClearRecentlyViewed}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center space-x-2 transition-colors border border-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear History</span>
          </button>
        )}
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(Math.min(4, filteredItems.length))].map((_, i) => (
            <div key={i} className="bg-neutral-900 h-64 border border-neutral-800 animate-pulse"></div>
          ))}
        </div>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((product) => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              sagacityStyle={true}
              showRemoveButton={true}
              onRemove={handleRemoveProduct}
            />
          ))}
        </div>
      </Suspense>
    </div>
  )
}

export default RecentlyViewedProducts