import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../../api/admin";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
      
      // Set filtered orders initially to all orders
      setFilteredOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchLower) ||
          (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
          (order.user?.email && order.user.email.toLowerCase().includes(searchLower)) ||
          (order.status && order.status.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => {
        if (statusFilter === "paid") return order.isPaid;
        if (statusFilter === "unpaid") return !order.isPaid;
        return order.status === statusFilter;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA, fieldB;

      // Handle nested fields and dates
      if (sortField === "createdAt" || sortField === "paidAt") {
        fieldA = a[sortField] ? new Date(a[sortField]).getTime() : 0;
        fieldB = b[sortField] ? new Date(b[sortField]).getTime() : 0;
      } else if (sortField === "user.name") {
        fieldA = a.user?.name?.toLowerCase() || "";
        fieldB = b.user?.name?.toLowerCase() || "";
      } else if (sortField === "totalPrice") {
        fieldA = parseFloat(a[sortField]) || 0;
        fieldB = parseFloat(b[sortField]) || 0;
      } else {
        fieldA = a[sortField] || "";
        fieldB = b[sortField] || "";
      }

      // Determine sort direction
      if (sortDirection === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    setFilteredOrders(result);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status, isPaid) => {
    if (status === "Delivered") return "bg-green-900/30 text-green-400 border border-green-700/40";
    if (status === "Shipped") return "bg-blue-900/30 text-blue-400 border border-blue-700/40";
    if (status === "Cancelled") return "bg-red-900/30 text-red-400 border border-red-700/40";
    if (isPaid) return "bg-yellow-900/30 text-yellow-400 border border-yellow-700/40";
    return "bg-neutral-900/30 text-neutral-400 border border-neutral-700/40";
  };

  // Pagination logic with console logging for debugging
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Enhanced pagination function with console logging
  const paginate = (pageNumber) => {
    console.log(`Attempting to paginate to page ${pageNumber}. Current page: ${currentPage}, Total pages: ${totalPages}`);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      console.log(`Paginating to page ${pageNumber}`);
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
        <div className="text-neutral-400">
          Total: {filteredOrders.length} orders
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchOrders}
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
      ) : filteredOrders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
          <p className="text-neutral-400">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "There are no orders in the system yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("_id")}
                  >
                    Order ID {getSortIcon("_id")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("user.name")}
                  >
                    Customer {getSortIcon("user.name")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("createdAt")}
                  >
                    Date {getSortIcon("createdAt")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("totalPrice")}
                  >
                    Total {getSortIcon("totalPrice")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      #{order._id.substring(order._id.length - 6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      <div>{order.user?.name || "N/A"}</div>
                      <div className="text-neutral-400 text-xs">{order.user?.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      ${parseFloat(order.totalPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status || (order.isPaid ? "Processing" : "Pending")}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-sm rounded-full py-1 px-3 ${getStatusBadgeClass(order.status, order.isPaid)} bg-opacity-10 bg-clip-padding appearance-none outline-none`}
                      >
                        <option value="Pending" className="bg-neutral-800 text-white">Pending</option>
                        <option value="Processing" className="bg-neutral-800 text-white">Processing</option>
                        <option value="Shipped" className="bg-neutral-800 text-white">Shipped</option>
                        <option value="Delivered" className="bg-neutral-800 text-white">Delivered</option>
                        <option value="Cancelled" className="bg-neutral-800 text-white">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-blue-500 hover:text-blue-400 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - Completely reimplemented */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="inline-flex shadow-sm rounded-md">
                {/* Previous button */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(prevPage => prevPage - 1);
                    }
                  }}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    currentPage === 1
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 text-sm font-medium border-l border-r border-neutral-700 ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {/* Next button */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(prevPage => prevPage + 1);
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    currentPage === totalPages
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminOrdersPage;
