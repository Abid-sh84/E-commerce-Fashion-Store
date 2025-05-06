"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { getProducts, getProductsByCategory, getProductCategories } from "../api/products"

// Background image slideshow component
const BackgroundSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set up a new timeout to change the image every 2 seconds
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    
    // Cleanup function to clear timeout when component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
  );
};

const ProductsPage = () => {
  // Background images for premium collection
  const backgroundImages = [
    "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  ];

  const [searchParams, setSearchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [activeFilters, setActiveFilters] = useState({
    category: searchParams.get("category") || "",
    universe: searchParams.get("universe") || "",
    type: searchParams.get("type") || "",
    priceRange: searchParams.get("price") || "",
    sortBy: searchParams.get("sort") || "newest",
  })
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    pages: 1,
    count: 0
  })
  const [categories, setCategories] = useState([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const tShirtTypes = [
    "Oversized",
    "Acid Wash",
    "Graphic Printed",
    "Solid Color",
    "Polo",
    "Sleeveless",
    "Long Sleeve",
    "Henley",
    "Hooded",
    "Crop Top",
  ]

  const universes = [
    "Marvel",
    "DC Comics",
    "Anime",
    "Classic Comics",
    "Sci-Fi & Fantasy",
    "Video Games",
    "Custom Fan Art",
  ]

  const priceRanges = [
    { id: "under-20", name: "Under $20", range: [0, 20] },
    { id: "20-30", name: "$20 - $30", range: [20, 30] },
    { id: "30-40", name: "$30 - $40", range: [30, 40] },
    { id: "over-40", name: "Over $40", range: [40, 1000] },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Apply search filter while preserving existing filters
      updateFiltersAndSearch({ search: searchTerm.trim() })
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    updateFiltersAndSearch({ search: "" })
  }
  
  const updateFiltersAndSearch = (newParams = {}) => {
    // Reset to page 1 when filters or search change
    setPagination(prev => ({ ...prev, page: 1 }))
    
    const updatedParams = { ...newParams }
    
    // Keep existing filters in the URL if they're not being updated
    if (!("category" in updatedParams) && activeFilters.category) {
      updatedParams.category = activeFilters.category
    }
    if (!("universe" in updatedParams) && activeFilters.universe) {
      updatedParams.universe = activeFilters.universe
    }
    if (!("type" in updatedParams) && activeFilters.type) {
      updatedParams.type = activeFilters.type
    }
    if (!("price" in updatedParams) && activeFilters.priceRange) {
      updatedParams.price = activeFilters.priceRange
    }
    if (!("sort" in updatedParams) && activeFilters.sortBy) {
      updatedParams.sort = activeFilters.sortBy
    }
    if (!("search" in updatedParams) && searchTerm) {
      updatedParams.search = searchTerm
    }
    
    // Update search params
    setSearchParams(updatedParams)
    
    // Update active filters state
    if ("category" in updatedParams) {
      setActiveFilters(prev => ({ ...prev, category: updatedParams.category || "" }))
    }
    if ("universe" in updatedParams) {
      setActiveFilters(prev => ({ ...prev, universe: updatedParams.universe || "" }))
    }
    if ("type" in updatedParams) {
      setActiveFilters(prev => ({ ...prev, type: updatedParams.type || "" }))
    }
    if ("price" in updatedParams) {
      setActiveFilters(prev => ({ ...prev, priceRange: updatedParams.price || "" }))
    }
    if ("sort" in updatedParams) {
      setActiveFilters(prev => ({ ...prev, sortBy: updatedParams.sort || "newest" }))
    }
    
    // Fetch products with updated filters
    fetchProducts(updatedParams, 1)
  }

  // Enhanced fetchProducts function to better handle backend data
  const fetchProducts = async (params = activeFilters, page = pagination.page) => {
    setIsLoading(true)
    
    try {
      // Format parameters for API call with consistent casing
      const apiParams = { 
        category: params.category ? params.category.toLowerCase() : '',
        universe: params.universe ? params.universe.toLowerCase() : '',
        type: params.type ? params.type.toLowerCase() : '',
        priceRange: params.priceRange || '',
        sortBy: params.sortBy || 'newest',
        keyword: params.search || '',
        page
      }
      
      console.log("Fetching products with params:", apiParams)
      
      try {
        const result = await getProducts(apiParams, page)
        
        if (result && result.products && result.products.length > 0) {
          // Process products to ensure consistent data structure
          const processedProducts = result.products.map(product => ({
            ...product,
            id: product._id || product.id, // Ensure id is available
            images: processImagesArray(product.images, product.category)
          }))
          
          setFilteredProducts(processedProducts)
          setPagination({
            page: result.page || page,
            pages: result.pages || 1,
            count: result.count || processedProducts.length
          })
        } else {
          // If no products found, show empty state
          setFilteredProducts([])
          setPagination({
            page: 1,
            pages: 1,
            count: 0
          })
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setFilteredProducts([])
        setPagination({
          page: 1,
          pages: 1,
          count: 0
        })
      }
    } catch (error) {
      console.error("Error in filter processing:", error)
      setFilteredProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to process images and add fallbacks
  const processImagesArray = (images, category) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return category && categoryFallbacks[category] 
        ? [categoryFallbacks[category][0]]
        : ["/placeholder.svg"]
    }
    
    // Filter out any invalid image URLs (like empty strings)
    return images.filter(img => img && typeof img === 'string')
  }

  // Function to handle when images fail to load
  const handleImageError = (e, category) => {
    if (!e.target) return;
    
    e.target.onerror = null; // Prevent infinite loop
    
    // Try category-specific fallback
    if (category && categoryFallbacks[category] && categoryFallbacks[category].length > 0) {
      e.target.src = categoryFallbacks[category][0];
    } else {
      // Use general fallback
      e.target.src = "/placeholder.svg";
    }
  };

  useEffect(() => {
    // Reset page when search or filters change
    if (searchParams.toString() !== "") {
      const page = parseInt(searchParams.get("page")) || 1
      const search = searchParams.get("search") || ""
      const category = searchParams.get("category") || ""
      const universe = searchParams.get("universe") || ""
      const type = searchParams.get("type") || ""
      const price = searchParams.get("price") || ""
      const sort = searchParams.get("sort") || "newest"
      
      setSearchTerm(search)
      setActiveFilters({
        category,
        universe,
        type,
        priceRange: price,
        sortBy: sort
      })
      
      setPagination(prev => ({...prev, page}))
      fetchProducts({
        category,
        universe,
        type,
        priceRange: price,
        sortBy: sort,
        search
      }, page)
    } else {
      fetchProducts()
    }
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    // Toggle the filter value
    const newValue = activeFilters[filterType] === value ? "" : value
    
    // Update the filters
    updateFiltersAndSearch({
      [filterType === 'priceRange' ? 'price' : filterType]: newValue,
      page: 1 // Reset to page 1 when changing filters
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setActiveFilters({
      category: "",
      universe: "",
      type: "",
      priceRange: "",
      sortBy: "newest",
    })
    setSearchParams({})
    fetchProducts({
      category: "",
      universe: "",
      type: "",
      priceRange: "",
      sortBy: "newest",
      search: ""
    }, 1)
  }
  
  const handleSortChange = (e) => {
    const newSortBy = e.target.value
    updateFiltersAndSearch({ sort: newSortBy })
  }
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return
    
    setPagination(prev => ({ ...prev, page: newPage }))
    
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage)
    setSearchParams(params)
    
    fetchProducts(activeFilters, newPage)
  }

  // Fallback images by category to ensure images display properly
  const categoryFallbacks = {
    dc: [
      "https://m.media-amazon.com/images/I/81j5XT1+IwL._AC_UX679_.jpg",
      "https://m.media-amazon.com/images/I/71F0DkIzxtL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/61pyhU5umNL._AC_UX679_.jpg"
    ],
    marvel: [
      "https://m.media-amazon.com/images/I/71jlppwpjPL._AC_UX679_.jpg",
      "https://m.media-amazon.com/images/I/61l7aBj17hL._AC_UX679_.jpg"
    ],
    anime: [
      "https://m.media-amazon.com/images/I/71jiGaGzHsL._AC_UX679_.jpg"
    ]
  };

  // Enhanced fetch categories function
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getProductCategories();
        console.log("Fetched categories:", data);
        
        if (Array.isArray(data)) {
          const processedCategories = data.map(category => {
            // Normalize category data
            const slug = category.name?.toLowerCase() || category._id || category.slug;
            const name = category.name || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Unknown');
            
            // Handle image with fallbacks
            let categoryImage = category.image;
            if (!categoryImage || categoryImage.includes('cloudinary.com')) {
              const categoryKey = slug.toLowerCase();
              if (categoryFallbacks[categoryKey] && categoryFallbacks[categoryKey].length > 0) {
                categoryImage = categoryFallbacks[categoryKey][0];
              } else {
                categoryImage = "/placeholder.svg";
              }
            }
            
            return {
              id: category._id || `category-${slug}`,
              name: name,
              slug: slug,
              count: category.count || 0,
              image: categoryImage
            };
          });
          setCategories(processedCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        
        // Create basic fallback categories if API fails
        const fallbackCategories = [
          {id: 'dc', name: 'DC', slug: 'dc', count: 0, image: categoryFallbacks.dc[0]},
          {id: 'marvel', name: 'Marvel', slug: 'marvel', count: 0, image: categoryFallbacks.marvel[0]},
          {id: 'anime', name: 'Anime', slug: 'anime', count: 0, image: categoryFallbacks.anime[0]}
        ];
        setCategories(fallbackCategories);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="relative z-10 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
        {/* Hero section with background slideshow */}
        <div className="relative overflow-hidden">
          <BackgroundSlideshow images={backgroundImages} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
            {/* Hero content with simplified styling */}
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center uppercase tracking-wider">
                Premium Collection
                <div className="h-1 w-24 bg-amber-600 mx-auto mt-5"></div>
              </h1>
              <p className="text-gray-200 text-center text-lg max-w-2xl mx-auto">
                Explore our curated selection of premium apparel designed for the modern fashion enthusiast
              </p>
            </div>
            
            {/* Search form with simplified styling */}
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  className="w-full py-3 pl-12 pr-10 rounded-none bg-neutral-800/60 border border-neutral-700/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition-all duration-300"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-12 pr-4 flex items-center text-neutral-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full bg-amber-700 hover:bg-amber-600 text-white font-medium px-6 border-none transition-all duration-300 uppercase tracking-wider"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filters button */}
          <div className="md:hidden mb-4">
            <button
              type="button"
              className="w-full bg-amber-700 text-white px-4 py-3 flex items-center justify-center border-none shadow-lg hover:bg-amber-600 transition-all duration-300 uppercase tracking-wider"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter Products
            </button>

            {/* Mobile filters */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-40 overflow-y-auto p-4 bg-neutral-950/90 backdrop-blur-sm">
                <div className="bg-neutral-900 p-6 max-w-md mx-auto border border-neutral-800 shadow-lg animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Filter Products</h2>
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-white transition-colors"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6 text-white">
                    <div>
                      <h3 className="font-bold text-white mb-3 uppercase tracking-wider">Categories</h3>
                      <div className="space-y-2 pl-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <input
                              id={`mobile-category-${category.id}`}
                              name="category"
                              type="checkbox"
                              className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600"
                              checked={activeFilters.category === category.slug}
                              onChange={() => handleFilterChange("category", category.slug)}
                            />
                            <label htmlFor={`mobile-category-${category.id}`} className="ml-3 text-sm text-neutral-300">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-white mb-3 uppercase tracking-wider">Universe</h3>
                      <div className="space-y-2 pl-2">
                        {universes.map((universe) => (
                          <div key={universe} className="flex items-center">
                            <input
                              id={`mobile-universe-${universe}`}
                              name="universe"
                              type="checkbox"
                              className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600"
                              checked={activeFilters.universe === universe.toLowerCase()}
                              onChange={() => handleFilterChange("universe", universe.toLowerCase())}
                            />
                            <label htmlFor={`mobile-universe-${universe}`} className="ml-3 text-sm text-neutral-300">
                              {universe}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-white mb-3 uppercase tracking-wider">T-Shirt Type</h3>
                      <div className="space-y-2 pl-2">
                        {tShirtTypes.map((type) => (
                          <div key={type} className="flex items-center">
                            <input
                              id={`mobile-type-${type}`}
                              name="type"
                              type="checkbox"
                              className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600"
                              checked={activeFilters.type === type.toLowerCase()}
                              onChange={() => handleFilterChange("type", type.toLowerCase())}
                            />
                            <label htmlFor={`mobile-type-${type}`} className="ml-3 text-sm text-neutral-300">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-white mb-3 uppercase tracking-wider">Price Range</h3>
                      <div className="space-y-2 pl-2">
                        {priceRanges.map((range) => (
                          <div key={range.id} className="flex items-center">
                            <input
                              id={`mobile-price-${range.id}`}
                              name="price"
                              type="checkbox"
                              className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600"
                              checked={activeFilters.priceRange === range.id}
                              onChange={() => handleFilterChange("priceRange", range.id)}
                            />
                            <label htmlFor={`mobile-price-${range.id}`} className="ml-3 text-sm text-neutral-300">
                              {range.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-neutral-800 pt-4">
                    <button
                      type="button"
                      className="text-sm text-amber-600 hover:text-amber-500 transition-colors uppercase tracking-wider"
                      onClick={clearAllFilters}
                    >
                      Clear all filters
                    </button>
                    <button
                      type="button"
                      className="bg-amber-700 hover:bg-amber-600 text-white font-medium px-6 py-2 uppercase tracking-wider transition-all duration-300"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 bg-neutral-900 p-6 border border-neutral-800 h-fit sticky top-24">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center group relative">
                      <button
                        className={`text-sm px-3 py-1.5 w-full text-left transition-all ${
                          activeFilters.category === category.slug 
                            ? "text-amber-500 font-medium" 
                            : "text-neutral-300 hover:text-amber-500"
                        }`}
                        onClick={() => handleFilterChange("category", category.slug)}
                      >
                        {category.name}
                      </button>
                      <span className="absolute h-[1px] w-0 bg-amber-600 left-0 bottom-0 transition-all duration-300 group-hover:w-full opacity-70"></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">Universe</h3>
                <div className="space-y-2">
                  {universes.map((universe) => (
                    <div key={universe} className="flex items-center">
                      <input
                        id={`universe-${universe}`}
                        name="universe"
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600"
                        checked={activeFilters.universe === universe.toLowerCase()}
                        onChange={() => handleFilterChange("universe", universe.toLowerCase())}
                      />
                      <label htmlFor={`universe-${universe}`} className="ml-3 text-sm text-neutral-300 hover:text-amber-500 cursor-pointer transition-colors">
                        {universe}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">T-Shirt Type</h3>
                <div className="space-y-2">
                  {tShirtTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`type-${type}`}
                        name="type"
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600"
                        checked={activeFilters.type === type.toLowerCase()}
                        onChange={() => handleFilterChange("type", type.toLowerCase())}
                      />
                      <label htmlFor={`type-${type}`} className="ml-3 text-sm text-neutral-300 hover:text-amber-500 cursor-pointer transition-colors">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={`price-${range.id}`}
                        name="price"
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600"
                        checked={activeFilters.priceRange === range.id}
                        onChange={() => handleFilterChange("priceRange", range.id)}
                      />
                      <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-neutral-300 hover:text-amber-500 cursor-pointer transition-colors">
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <button
                  type="button"
                  className="w-full py-2 border border-amber-600 text-amber-500 hover:bg-amber-800/30 transition-colors flex items-center justify-center gap-2 group uppercase tracking-wider text-sm font-medium"
                  onClick={clearAllFilters}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Display Area */}
          <div className="flex-1">
            {/* Product count and sort controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-neutral-900 p-4 border border-neutral-800">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center uppercase tracking-wider">
                  {isLoading ? (
                    <span className="inline-block w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : null}
                  {!isLoading && (
                    <>
                      <span>{pagination.count}</span> {pagination.count === 1 ? "Product" : "Products"} 
                      {activeFilters.category && categories.find(c => c.slug === activeFilters.category) && (
                        <span className="ml-2 text-amber-500">in {categories.find(c => c.slug === activeFilters.category).name}</span>
                      )}
                      {searchTerm && (
                        <span className="ml-2 text-amber-500">matching "{searchTerm}"</span>
                      )}
                    </>
                  )}
                </h2>
              </div>

              <div className="mt-4 sm:mt-0 relative z-10">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                  <select
                    value={activeFilters.sortBy}
                    onChange={handleSortChange}
                    className="bg-neutral-800 text-white border border-neutral-700 py-2 pl-3 pr-10 focus:outline-none focus:border-amber-600 appearance-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Products grid with loading state */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-neutral-900 animate-pulse h-96 border border-neutral-800">
                    <div className="h-72 bg-neutral-800 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-neutral-700 to-neutral-800"></div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-neutral-800 rounded-full w-3/4"></div>
                      <div className="h-4 bg-neutral-800 rounded-full w-1/2"></div>
                      <div className="h-6 bg-neutral-800 rounded-full w-1/4 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id || product._id} 
                    product={{
                      ...product,
                      onImageError: (e) => handleImageError(e, product.category)
                    }} 
                    sagacityStyle={true} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-neutral-900 border border-neutral-800 animate-fadeIn mb-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-amber-500 mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">No products found</h3>
                <p className="text-neutral-400 mb-8 max-w-md mx-auto">Try adjusting your filters or search term to find what you're looking for.</p>
                <button 
                  onClick={clearAllFilters} 
                  className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-medium uppercase tracking-wider border-none transform hover:translate-y-[-5px] transition-all duration-300 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && pagination.pages > 1 && (
              <div className="flex justify-center mb-12">
                <nav className="flex items-center space-x-1 bg-neutral-900 p-2 border border-neutral-800">
                  <button 
                    className={`px-4 py-2 ${
                      pagination.page <= 1 
                        ? "text-neutral-500 cursor-not-allowed" 
                        : "text-white hover:text-amber-500 transition-colors"
                    }`}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    // Calculate page number to show (for pagination with many pages)
                    let pageToShow = i + 1;
                    if (pagination.pages > 5) {
                      if (pagination.page > 3 && pagination.page < pagination.pages - 1) {
                        pageToShow = pagination.page - 2 + i;
                      } else if (pagination.page >= pagination.pages - 1) {
                        pageToShow = pagination.pages - 4 + i;
                      }
                    }
                    
                    // Only show the page if it's valid
                    if (pageToShow <= pagination.pages) {
                      return (
                        <button 
                          key={i} 
                          className={`w-10 h-10 flex items-center justify-center transition-all ${
                            pagination.page === pageToShow 
                              ? "bg-amber-700 text-white" 
                              : "text-neutral-400 hover:text-amber-500"
                          }`}
                          onClick={() => handlePageChange(pageToShow)}
                        >
                          {pageToShow}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button 
                    className={`px-4 py-2 ${
                      pagination.page >= pagination.pages 
                        ? "text-neutral-500 cursor-not-allowed" 
                        : "text-white hover:text-amber-500 transition-colors"
                    }`}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
