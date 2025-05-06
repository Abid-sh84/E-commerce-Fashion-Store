import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../api/admin";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [universeFilter, setUniverseFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");
  const productsPerPage = 10;
  const [categories, setCategories] = useState([]);

  const universes = [
    "Marvel",
    "DC Comics",
    "Anime",
    "Classic Comics",
    "Sci-Fi & Fantasy",
    "Video Games",
    "Custom Fan Art",
  ];

  const productTypes = [
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
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, searchTerm, categoryFilter, universeFilter, typeFilter, sortField, sortDirection]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      
      // Extract unique categories for the filter dropdown
      const uniqueCategories = [...new Set(fetchedProducts.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.universe.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    // Apply universe filter
    if (universeFilter !== "all") {
      result = result.filter((product) => 
        product.universe && product.universe.toLowerCase() === universeFilter.toLowerCase()
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((product) => 
        product.type && product.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA, fieldB;

      // Handle different field types
      if (sortField === "createdAt" || sortField === "updatedAt") {
        fieldA = new Date(a[sortField]).getTime();
        fieldB = new Date(b[sortField]).getTime();
      } else if (sortField === "price" || sortField === "countInStock") {
        fieldA = parseFloat(a[sortField]);
        fieldB = parseFloat(b[sortField]);
      } else if (sortField === "name" || sortField === "category") {
        fieldA = a[sortField].toLowerCase();
        fieldB = b[sortField].toLowerCase();
      } else {
        fieldA = a[sortField];
        fieldB = b[sortField];
      }

      // Determine sort direction
      if (sortDirection === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, set the new field and default to desc
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;

    return (
      <span className="ml-1">
        {sortDirection === "asc" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      
      // Update local state by removing the product
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
      setConfirmDelete(null);
      
      setActionSuccess("Product deleted successfully");
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again.");
    }
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Products Management</h1>
        <Link
          to="/admin/products/new"
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {actionSuccess && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-300 px-4 py-3 mb-6 rounded-md">
          {actionSuccess}
        </div>
      )}

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, description, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={universeFilter}
            onChange={(e) => setUniverseFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Universes</option>
            {universes.map((universe) => (
              <option key={universe} value={universe}>
                {universe}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={fetchProducts}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="spinner h-12 w-12 border-4 border-t-4 border-neutral-800 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
          <p className="text-neutral-400">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "There are no products in the system yet."}
          </p>
          {filteredProducts.length === 0 && products.length === 0 && (
            <Link
              to="/admin/products/new"
              className="mt-4 inline-block bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Create Your First Product
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Products Table */}
          <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("name")}
                  >
                    Product {getSortIcon("name")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("category")}
                  >
                    Category {getSortIcon("category")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("price")}
                  >
                    Price {getSortIcon("price")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("countInStock")}
                  >
                    Stock {getSortIcon("countInStock")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-neutral-800/30">
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-neutral-800">
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'} 
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-white">{product.name}</div>
                          <div className="text-xs text-neutral-400">ID: {product._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      <div className="flex flex-col">
                        <span className="capitalize">{product.category}</span>
                        <span className="text-xs text-neutral-400">{product.universe}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      <div className="flex flex-col">
                        {product.discount > 0 ? (
                          <>
                            <span className="line-through text-neutral-500">{formatPrice(product.price)}</span>
                            <span className="text-green-400">
                              {formatPrice(product.price * (1 - product.discount / 100))}
                              <span className="ml-1 text-xs">({product.discount}% off)</span>
                            </span>
                          </>
                        ) : (
                          <span>{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${
                        product.countInStock > 10
                          ? "text-green-400"
                          : product.countInStock > 0
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}>
                        {product.countInStock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-500 hover:text-blue-400 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(product._id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete product"
                      >
                        Delete
                      </button>

                      {/* Delete confirmation dialog */}
                      {confirmDelete === product._id && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
                          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-sm mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                            <p className="text-neutral-300 mb-6">
                              Are you sure you want to delete the product <span className="font-semibold text-white">{product.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "text-neutral-500 cursor-not-allowed"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number + 1
                        ? "bg-blue-700 text-white"
                        : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "text-neutral-500 cursor-not-allowed"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminProductsPage;
