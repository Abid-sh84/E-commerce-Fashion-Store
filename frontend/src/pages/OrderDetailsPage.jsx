"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getOrderById, requestOrderCancellation } from "../api/orders"

const OrderDetailsPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Order cancellation states
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelError, setCancelError] = useState(null)
  const [cancelSuccess, setCancelSuccess] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const data = await getOrderById(id)
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrderDetails()
    }
  }, [id])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge class based on status
  const getStatusBadgeClass = (status, isPaid) => {
    if (status === "Delivered") {
      return "bg-green-900/50 text-green-300 border border-green-700/50"
    } else if (isPaid) {
      return "bg-blue-900/50 text-blue-300 border border-blue-700/50"
    } else {
      return "bg-yellow-900/50 text-yellow-300 border border-yellow-700/50"
    }
  }

  // Safe number formatting with fallback to 0
  const formatPrice = (price) => {
    return (price || 0).toFixed(2);
  }

  // Handle order cancellation request
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }

    try {
      setIsCancelling(true);
      setCancelError(null);
      
      // Call the API to cancel the order
      await requestOrderCancellation(id, { reason: cancelReason });
      
      // Update order with cancelled status
      const updatedOrder = await getOrderById(id);
      setOrder(updatedOrder);
      
      // Show success message and close dialog
      setCancelSuccess("Cancellation request submitted successfully");
      setShowCancelDialog(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setCancelSuccess(null), 3000);
      
    } catch (error) {
      console.error("Error cancelling order:", error);
      setCancelError(error.message || "Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors">Home</Link>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link to="/profile" className="ml-2 text-gray-400 hover:text-amber-500 transition-colors">Profile</Link>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link to="/profile?tab=orders" className="ml-2 text-gray-400 hover:text-amber-500 transition-colors">Orders</Link>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="ml-2 text-amber-500">Order Details</span>
              </li>
            </ol>
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner h-12 w-12 border-4 border-t-4 border-neutral-800 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p>{error}</p>
            <Link to="/profile?tab=orders" className="mt-4 inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </Link>
          </div>
        ) : order ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
                  Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Details</span>
                </h1>
                <div className="h-0.5 w-24 bg-amber-500 mb-4"></div>
                <p className="text-gray-400">Order ID: #{order._id}</p>
              </div>
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-full inline-flex items-center ${
                  getStatusBadgeClass(order.status, order.isPaid)
                }`}
              >
                {order.status === "Delivered" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : order.isPaid ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {order.status || (order.isPaid ? "Paid" : "Processing")}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary and Items */}
              <div className="lg:col-span-2 space-y-8">
                {/* Order Timeline */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg p-6">
                  <h2 className="text-xl font-bold text-white flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order Timeline
                  </h2>

                  <div className="relative pl-8 border-l border-neutral-700">
                    <div className="mb-8 relative">
                      <div className="absolute -left-[25px] mt-1.5">
                        <div className="bg-amber-500 rounded-full h-5 w-5 flex items-center justify-center">
                          <div className="bg-amber-300 rounded-full h-2 w-2"></div>
                        </div>
                      </div>
                      <h3 className="text-amber-500 font-medium">Order Placed</h3>
                      <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                    </div>

                    <div className="mb-8 relative">
                      <div className="absolute -left-[25px] mt-1.5">
                        <div className={`${order.isPaid ? 'bg-amber-500' : 'bg-neutral-700'} rounded-full h-5 w-5 flex items-center justify-center`}>
                          {order.isPaid && <div className="bg-amber-300 rounded-full h-2 w-2"></div>}
                        </div>
                      </div>
                      <h3 className={`${order.isPaid ? 'text-amber-500' : 'text-gray-500'} font-medium`}>Payment Confirmed</h3>
                      <p className="text-gray-400 text-sm">{order.isPaid ? formatDate(order.paidAt) : "Pending"}</p>
                    </div>

                    <div className="mb-8 relative">
                      <div className="absolute -left-[25px] mt-1.5">
                        <div className={`${order.status === "Shipped" || order.status === "Delivered" ? 'bg-amber-500' : 'bg-neutral-700'} rounded-full h-5 w-5 flex items-center justify-center`}>
                          {(order.status === "Shipped" || order.status === "Delivered") && <div className="bg-amber-300 rounded-full h-2 w-2"></div>}
                        </div>
                      </div>
                      <h3 className={`${order.status === "Shipped" || order.status === "Delivered" ? 'text-amber-500' : 'text-gray-500'} font-medium`}>Shipped</h3>
                      <p className="text-gray-400 text-sm">{order.status === "Shipped" || order.status === "Delivered" ? "Your order is on the way" : "Preparing for shipment"}</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[25px] mt-1.5">
                        <div className={`${order.status === "Delivered" ? 'bg-amber-500' : 'bg-neutral-700'} rounded-full h-5 w-5 flex items-center justify-center`}>
                          {order.status === "Delivered" && <div className="bg-amber-300 rounded-full h-2 w-2"></div>}
                        </div>
                      </div>
                      <h3 className={`${order.status === "Delivered" ? 'text-amber-500' : 'text-gray-500'} font-medium`}>Delivered</h3>
                      <p className="text-gray-400 text-sm">{order.status === "Delivered" ? formatDate(order.deliveredAt) : "Pending delivery"}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-neutral-800">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Order Items
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-neutral-800">
                    {order.orderItems && order.orderItems.map((item) => (
                      <div key={`${item.product}-${item.size}`} className="p-6 flex gap-4 group">
                        <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white group-hover:text-amber-500 transition-colors">{item.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs font-medium bg-neutral-800 text-gray-300 px-2 py-0.5 rounded-full">Size: {item.size}</span>
                            <span className="ml-2 text-xs font-medium bg-neutral-800 text-gray-300 px-2 py-0.5 rounded-full">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-500">${formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                          <p className="text-xs text-gray-400">${formatPrice(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 space-y-8">
                {/* Summary Card */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-neutral-800">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Order Summary
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Order ID</span>
                        <span className="font-medium text-white break-all">{order._id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Date Placed</span>
                        <span className="font-medium text-white">{formatDate(order.createdAt).split(',')[0]}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Items</span>
                        <span className="font-medium text-white">
                          {order.orderItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-800 pt-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="font-medium text-white">${formatPrice(order.itemsPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Shipping</span>
                          <span className="font-medium text-white">${formatPrice(order.shippingPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Tax</span>
                          <span className="font-medium text-white">${formatPrice(order.taxPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-neutral-800 pt-4 mb-6">
                      <span className="text-lg text-white font-medium">Total</span>
                      <span className="text-xl font-bold text-amber-500">${formatPrice(order.totalPrice)}</span>
                    </div>

                    <div className="flex items-center bg-neutral-800 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="text-sm text-gray-300">
                        Payment via <span className="text-white font-medium">{order.paymentMethod}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-neutral-800">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Shipping Address
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="font-medium text-white">{order.user?.name || 'Customer'}</p>
                      <p className="text-gray-400">{order.shippingAddress?.address}</p>
                      <p className="text-gray-400">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                      </p>
                      <p className="text-gray-400">{order.shippingAddress?.country}</p>
                    </div>

                    {order.user?.email && (
                      <div className="flex items-center mt-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {order.user.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <Link
                    to="/profile?tab=orders"
                    className="flex items-center justify-center py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                  </Link>

                  <button
                    className="flex items-center justify-center py-3 px-4 bg-indigo-800/70 hover:bg-indigo-700/70 text-white rounded-lg transition-colors"
                    onClick={() => window.print()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Receipt
                  </button>
                  
                  {/* Add Cancel Order button if order is not delivered or already cancelled */}
                  {order.status !== "Delivered" && order.status !== "Cancelled" && (
                    <button
                      className="flex items-center justify-center py-3 px-4 bg-red-800/70 hover:bg-red-700/70 text-white rounded-lg transition-colors"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Order
                    </button>
                  )}

                  {/* Show cancellation status if order is cancelled or cancellation is pending */}
                  {order.status === "Cancelled" && (
                    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
                      <p className="font-medium">Order Cancelled</p>
                      {order.cancelDetails && (
                        <p className="text-sm mt-1">Reason: {order.cancelDetails.reason}</p>
                      )}
                    </div>
                  )}
                  
                  {order.cancelDetails && order.status !== "Cancelled" && (
                    <div className="bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 px-4 py-3 rounded-lg">
                      <p className="font-medium">Cancellation Requested</p>
                      <p className="text-sm mt-1">Status: {order.cancelDetails.status}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-500/70 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Order Not Found</h3>
            <p className="text-gray-400 mb-6">We couldn't find the order you're looking for.</p>
            <Link
              to="/profile?tab=orders"
              className="inline-flex items-center justify-center py-2 px-4 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </Link>
          </div>
        )}

        {/* Cancel Order Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Cancel Order</h2>
              <p className="text-gray-400 mb-4">Please provide a reason for cancelling your order:</p>
              <textarea
                className="w-full p-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:outline-none focus:border-amber-500"
                rows="4"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              ></textarea>
              {cancelError && <p className="text-red-500 text-sm mt-2">{cancelError}</p>}
              {cancelSuccess && <p className="text-green-500 text-sm mt-2">Cancellation request submitted successfully.</p>}
              <div className="flex justify-end mt-4">
                <button
                  className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors mr-2"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Close
                </button>
                <button
                  className="py-2 px-4 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetailsPage
