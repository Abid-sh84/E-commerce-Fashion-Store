import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/config";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isDeleting, setIsDeleting] = useState(false);

  // Load reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [filter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authorized");
      }

      // Construct query parameters
      let url = `${API_URL}/api/reviews`;
      
      // Add filter parameters if needed
      if (filter !== "all") {
        url += `?rating=${filter}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let reviewData = response.data;
      
      // Apply client-side sorting
      if (sortBy === "newest") {
        reviewData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "oldest") {
        reviewData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === "highest") {
        reviewData.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === "lowest") {
        reviewData.sort((a, b) => a.rating - b.rating);
      }
      
      setReviews(reviewData);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId, productId) => {
    try {
      setIsDeleting(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authorized");
      }

      await axios.delete(`${API_URL}/api/reviews/${productId}/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh reviews list
      fetchReviews();
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Error deleting review:", err);
      setError(err.response?.data?.message || "Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter reviews by search term
  const filteredReviews = searchTerm
    ? reviews.filter(
        (review) =>
          review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (review.product && review.product.name && 
            review.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : reviews;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
            Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Reviews</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mt-2"></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700/50 text-red-300 px-4 py-3 rounded-md mb-6 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                fetchReviews();
              }}
              className="text-amber-500 hover:text-amber-400 mt-2 text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="filter" className="block text-sm text-gray-400 mb-1">Filter by Rating</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm text-gray-400 mb-1">Sort By</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-72">
            <label htmlFor="search" className="block text-sm text-gray-400 mb-1">Search Reviews</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by product, user or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner h-12 w-12 border-4 border-t-4 border-neutral-800 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-lg font-medium">No reviews found</p>
              <p className="text-sm mt-2">
                {searchTerm ? "Try adjusting your search term" : "There are no reviews matching the selected filter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-800">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-neutral-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="h-8 w-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-white">
                                {review.name ? review.name.charAt(0).toUpperCase() : "U"}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">{review.name}</div>
                            <div className="text-xs text-gray-400">{review.user}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {review.product ? (
                          <Link 
                            to={`/product/${review.product._id}`}
                            className="text-amber-500 hover:text-amber-400"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {review.product.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">Unknown Product</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 ${
                                index < review.rating ? "text-amber-500" : "text-neutral-700"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-white">{review.title}</div>
                          <div className="text-sm text-gray-400 truncate">
                            {review.comment}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setConfirmDeleteId(review._id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirmation dialog for deleting review */}
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Delete Review</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const review = reviews.find(r => r._id === confirmDeleteId);
                  handleDeleteReview(confirmDeleteId, review?.product?._id);
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Delete Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;