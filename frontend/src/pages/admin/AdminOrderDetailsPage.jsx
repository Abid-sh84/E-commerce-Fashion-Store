import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, markCashOnDeliveryOrderAsPaid } from "../../api/orders";
import { updateOrderStatus } from "../../api/admin";
import InvoiceModal from "../../components/InvoiceModal";

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedOrder = await getOrderById(id);
        setOrder(fetchedOrder);
        setNewStatus(fetchedOrder.status || "Processing");
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-900/30 text-green-400";
      case "Shipped":
        return "bg-blue-900/30 text-blue-400";
      case "Processing":
        return "bg-yellow-900/30 text-yellow-400";
      case "Pending":
        return "bg-orange-900/30 text-orange-400";
      case "Cancelled":
        return "bg-red-900/30 text-red-400";
      default:
        return "bg-neutral-900/30 text-neutral-400";
    }
  };

  const updateOrderStatusHandler = async () => {
    if (newStatus === order.status) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      
      // Update local state
      setOrder(prev => ({ ...prev, status: newStatus }));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (order.isPaid) return;
    
    setIsMarkingPaid(true);
    try {
      const updatedOrder = await markCashOnDeliveryOrderAsPaid(id);
      
      // Update local state
      setOrder(updatedOrder);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error marking order as paid:", error);
      setError("Failed to mark order as paid. Please try again.");
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handlePrintInvoice = () => {
    setShowInvoice(true);
  };

  const handleEmailCustomer = () => {
    if (order && order.user && order.user.email) {
      window.location.href = `mailto:${order.user.email}?subject=Your Order ${order.id || id} Update&body=Hello ${order.user.name},\n\nThank you for your order with Starry Comics. Here's an update on your recent purchase.`;
    } else {
      alert("Customer email not available");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-12 w-12 border-4 border-t-4 border-neutral-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Error</h2>
        <p className="text-neutral-400 mb-4">{error}</p>
        <Link to="/admin/orders" className="text-blue-500 hover:text-blue-400">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-neutral-400 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/admin/orders" className="text-blue-500 hover:text-blue-400">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      {showInvoice && order && (
        <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Order #{order._id}</h1>
          <p className="text-neutral-400">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Link 
          to="/admin/orders" 
          className="mt-4 sm:mt-0 text-neutral-400 hover:text-white flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Orders
        </Link>
      </div>

      {updateSuccess && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-300 px-4 py-3 mb-6 rounded-md">
          Order status updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details and Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Order Status</h2>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                  {order.status || 'Processing'}
                </span>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-md mr-2 p-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  onClick={updateOrderStatusHandler}
                  disabled={isUpdating || newStatus === order.status}
                  className={`px-4 py-2 rounded-md ${
                    isUpdating || newStatus === order.status
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : "bg-blue-700 text-white hover:bg-blue-600"
                  }`}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Payment Information</h3>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <p className="text-neutral-300 mb-2">
                    <span className="font-medium text-white">Method:</span> {order.paymentMethod}
                  </p>
                  <p className="text-neutral-300 mb-2">
                    <span className="font-medium text-white">Status:</span>{" "}
                    <span className={order.isPaid ? "text-green-500" : "text-red-500"}>
                      {order.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </p>
                  {order.isPaid && (
                    <p className="text-neutral-300">
                      <span className="font-medium text-white">Date:</span> {formatDate(order.paidAt)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Shipping Information</h3>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <p className="text-neutral-300 mb-2">
                    <span className="font-medium text-white">Status:</span>{" "}
                    <span className={order.isDelivered ? "text-green-500" : "text-blue-500"}>
                      {order.isDelivered ? "Delivered" : "Not Delivered"}
                    </span>
                  </p>
                  <p className="text-neutral-300">
                    <span className="font-medium text-white">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state || ''}, {order.shippingAddress.zip || order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">Order Items</h2>
            </div>
            <div className="divide-y divide-neutral-800">
              {order.orderItems.map((item) => (
                <div key={item._id || `${item.product}-${item.size}`} className="p-6 flex flex-col sm:flex-row justify-between">
                  <div className="flex">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-col">
                      <h3 className="text-base font-medium text-white">{item.name}</h3>
                      <p className="mt-1 text-sm text-neutral-400">Size: {item.size}</p>
                      <p className="mt-1 text-sm text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-base font-medium text-white">${formatPrice(item.price * item.quantity)}</p>
                    <p className="mt-1 text-sm text-neutral-400">${formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Notes</h2>
              <p className="text-neutral-300 bg-neutral-800 p-4 rounded-md">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Customer Information and Order Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-400">Name</p>
                <p className="text-white">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Email</p>
                <p className="text-white">{order.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Phone</p>
                <p className="text-white">{order.shippingAddress.phone || "Not provided"}</p>
              </div>
              <Link 
                to={`/admin/users/${order.user._id}`} 
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                View Customer Profile
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-white">${formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Shipping</span>
                <span className="text-white">${formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Tax</span>
                <span className="text-white">${formatPrice(order.taxPrice)}</span>
              </div>
              <div className="border-t border-neutral-800 pt-3 mt-3 flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-white">${formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handlePrintInvoice}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex justify-center items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
            <button 
              onClick={handleEmailCustomer}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-md flex justify-center items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Customer
            </button>
            
            {/* Show Mark as Paid button only for Cash on Delivery orders that are not paid */}
            {order.paymentMethod === 'Cash on Delivery' && !order.isPaid && (
              <button 
                onClick={handleMarkAsPaid}
                disabled={isMarkingPaid}
                className={`w-full py-2 px-4 rounded-md flex justify-center items-center ${
                  isMarkingPaid
                    ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                    : "bg-green-700 text-white hover:bg-green-600"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isMarkingPaid ? "Processing..." : "Mark Cash Payment as Received"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrderDetailsPage;
