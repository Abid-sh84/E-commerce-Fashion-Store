"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { createOrder, updateOrderToPaid } from "../api/orders"
import { useAuth } from "../contexts/AuthContext"
import PayPalButton from "../components/PayPalButton"
import { getAddresses } from "../api/user" // Ensure this import matches the export in the API file

const CheckoutPage = () => {
  const { 
    cartItems, 
    cartTotal, 
    clearCart, 
    prepareOrderItems, 
    discountAmount,
    couponCode,
    couponApplied 
  } = useCart()
  const { isAuthenticated, currentUser } = useAuth() // Add currentUser
  const navigate = useNavigate()
  const [showStars, setShowStars] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderTotal, setOrderTotal] = useState(0)
  const [error, setError] = useState(null)
  // New state for payment method
  const [paymentMethod, setPaymentMethod] = useState("PayPal")
  // Add state to store order data temporarily for PayPal
  const [pendingOrderData, setPendingOrderData] = useState(null)

  // Add states for saved addresses
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [useNewAddress, setUseNewAddress] = useState(true) // By default, allow user to enter new address

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  })
  
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch user's saved addresses when component loads
  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedAddresses()
      
      // Pre-fill email from user profile
      if (currentUser?.email) {
        setFormData(prev => ({
          ...prev,
          email: currentUser.email
        }))
      }
      
      // Split name into first and last name if available
      if (currentUser?.name) {
        const nameParts = currentUser.name.split(' ')
        if (nameParts.length > 0) {
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' ')
          }))
        }
      }
    }
  }, [isAuthenticated, currentUser])

  // Function to fetch saved addresses
  const fetchSavedAddresses = async () => {
    if (!isAuthenticated) return

    try {
      setLoadingAddresses(true)
      const addresses = await getAddresses()
      setSavedAddresses(addresses)
      
      // If there's a default address, select it
      const defaultAddress = addresses.find(addr => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id)
        setUseNewAddress(false) // Use the saved address
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoadingAddresses(false)
    }
  }

  // Function to handle selecting an address
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId)
    
    if (addressId === "new") {
      setUseNewAddress(true)
      // Clear form fields
      setFormData(prev => ({
        ...prev,
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "United States"
      }))
    } else {
      setUseNewAddress(false)
      // Find the selected address
      const selectedAddress = savedAddresses.find(addr => addr._id === addressId)
      if (selectedAddress) {
        // Fill the form with selected address data
        setFormData(prev => ({
          ...prev,
          address: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
          country: selectedAddress.country || "United States"
        }))
      }
    }
  }

  // We're using a simplified single step checkout now
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    
    // Don't validate address fields if using a saved address
    if (useNewAddress || !selectedAddressId) {
      if (!formData.address.trim()) newErrors.address = "Street address is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.state.trim()) newErrors.state = "State is required"
      if (!formData.zip.trim()) newErrors.zip = "ZIP code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate prices
      const taxPrice = cartTotal * 0.1;  // 10% tax
      const shippingPrice = cartTotal > 100 ? 0 : 9.99; // Free shipping over $100
      const totalPrice = (cartTotal - discountAmount) + shippingPrice + taxPrice;
      
      // Get order items in the correct format
      const orderItems = prepareOrderItems();
      
      // Create shipping address object based on form selection
      let shippingAddress = {};
      
      if (!useNewAddress && selectedAddressId) {
        // Using a saved address - find the selected address
        const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
        if (selectedAddress) {
          shippingAddress = {
            address: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.zip,
            country: selectedAddress.country || "United States",
          };
        }
      } else {
        // Using the address entered in the form
        shippingAddress = {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zip,
          country: formData.country,
        };
      }
      
      // Create order data object with shipping address and selected payment method
      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice
      };

      console.log("Prepared order data:", orderData);
      
      // Different flow based on payment method
      if (paymentMethod === "Cash on Delivery") {
        // For COD, create order immediately
        const createdOrder = await createOrder(orderData);
        console.log("Order created successfully:", createdOrder);
        setCreatedOrderId(createdOrder._id);
        clearCart();
        // Redirect to order details page
        navigate(`/order/${createdOrder._id}`);
      } else {
        // For PayPal, store order data and show PayPal button
        setPendingOrderData(orderData);
        setOrderTotal(totalPrice);
        setOrderPlaced(true);
      }
      
    } catch (error) {
      console.error('Error during checkout process:', error);
      let errorMessage = 'Failed to process checkout. Please try again.';
      
      if (error.response) {
        console.error('Server response:', error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      if (!pendingOrderData) {
        throw new Error('Order data is missing');
      }
      
      // Now create the order after successful payment
      const createdOrder = await createOrder(pendingOrderData);
      const orderId = createdOrder._id;
      
      // Update order to paid status
      await updateOrderToPaid(orderId, paymentResult);
      
      // Clear cart and redirect to order confirmation
      clearCart();
      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || 'Failed to process payment. Please contact support.');
    }
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wider">
            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Order</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Please review your items and provide your shipping information</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700/50 text-red-300 px-4 py-3 rounded-md mb-6 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {!cartItems.length ? (
          <div className="bg-neutral-900 rounded-lg p-8 text-center border border-neutral-800 shadow-lg">
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty!</h2>
            <p className="text-gray-400 mb-8">Add some products to your cart to continue checkout.</p>
            <Link to="/products" className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all">
              Browse Products
            </Link>
          </div>
        ) : orderPlaced ? (
          // PayPal payment section displayed after order creation
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Almost there!</h2>
              <p className="text-gray-400 mb-8">Complete your payment with PayPal to finish your order.</p>
            </div>
            
            <div className="max-w-md mx-auto bg-neutral-800 p-6 rounded-lg mb-8">
              <div className="mb-4 flex justify-between">
                <span className="text-gray-300">Order Total:</span>
                <span className="font-bold text-amber-500">${orderTotal.toFixed(2)}</span>
              </div>
              
              <PayPalButton 
                amount={orderTotal} 
                onSuccess={handlePaymentSuccess} 
              />
            </div>
            
            <div className="text-center text-sm text-gray-400">
              <p>You'll be redirected to PayPal to complete your payment securely.</p>
              <p className="mt-2">Your order will be confirmed once payment is complete.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-neutral-800">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Shipping Information
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  {/* Contact Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-amber-500 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-amber-500 font-medium mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full bg-neutral-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              errors.firstName ? "border-red-500" : "border-neutral-700 hover:border-neutral-600"
                            }`}
                            placeholder="John"
                          />
                          {errors.firstName && 
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          }
                        </div>
                        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-amber-500 font-medium mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full bg-neutral-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              errors.lastName ? "border-red-500" : "border-neutral-700 hover:border-neutral-600"
                            }`}
                            placeholder="Doe"
                          />
                          {errors.lastName && 
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          }
                        </div>
                        {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-amber-500 font-medium mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-neutral-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              errors.email ? "border-red-500" : "border-neutral-700 hover:border-neutral-600"
                            }`}
                            placeholder="your@email.com"
                          />
                          {errors.email && 
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          }
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-amber-500 font-medium mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-neutral-800 text-white border border-neutral-700 hover:border-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Saved Addresses Section */}
                  {isAuthenticated && savedAddresses.length > 0 && (
                    <div className="mb-8 border-t border-neutral-800 pt-6">
                      <h3 className="text-lg font-medium text-amber-500 mb-4">Saved Addresses</h3>
                      
                      {loadingAddresses ? (
                        <div className="flex justify-center py-4">
                          <div className="spinner h-8 w-8 border-4 border-t-4 border-neutral-800 border-t-amber-500 rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {savedAddresses.map(address => (
                            <div key={address._id} className="flex items-start space-x-3">
                              <input
                                type="radio"
                                id={`address-${address._id}`}
                                name="addressSelection"
                                value={address._id}
                                checked={selectedAddressId === address._id}
                                onChange={() => handleAddressSelect(address._id)}
                                className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600"
                              />
                              <label htmlFor={`address-${address._id}`} className="flex-grow">
                                <div className={`p-4 rounded-lg cursor-pointer ${
                                  selectedAddressId === address._id 
                                    ? "bg-amber-800/30 border border-amber-700/50"
                                    : "bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
                                }`}>
                                  <div className="font-medium text-white">{address.name} {address.isDefault && <span className="ml-2 text-xs bg-amber-600/70 px-2 py-0.5 rounded-full">Default</span>}</div>
                                  <div className="text-gray-300 text-sm mt-1">{address.street}</div>
                                  <div className="text-gray-300 text-sm">{address.city}, {address.state} {address.zip}</div>
                                  <div className="text-gray-300 text-sm">{address.country}</div>
                                </div>
                              </label>
                            </div>
                          ))}
                          
                          {/* Option to enter new address */}
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              id="address-new"
                              name="addressSelection"
                              value="new"
                              checked={useNewAddress}
                              onChange={() => handleAddressSelect("new")}
                              className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600"
                            />
                            <label htmlFor="address-new" className="flex-grow">
                              <div className={`p-4 rounded-lg cursor-pointer ${
                                useNewAddress
                                  ? "bg-amber-800/30 border border-amber-700/50"
                                  : "bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
                              }`}>
                                <div className="font-medium text-white flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                  Enter a new address
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Shipping Address */}
                  <div className={`mb-8 ${isAuthenticated && savedAddresses.length > 0 ? 'border-t border-neutral-800 pt-6' : ''}`}>
                    <h3 className="text-lg font-medium text-amber-500 mb-4">
                      {isAuthenticated && savedAddresses.length > 0 && !useNewAddress 
                        ? "Selected Shipping Address" 
                        : "Shipping Address"}
                    </h3>
                    
                    {/* Show address fields only if using new address or no saved addresses */}
                    {(useNewAddress || savedAddresses.length === 0) && (
                      <>
                        <div className="mb-6">
                          <label htmlFor="address" className="block text-amber-500 font-medium mb-2">
                            Address
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className={`w-full bg-neutral-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                errors.address ? "border-red-500" : "border-neutral-700 hover:border-neutral-600"
                              }`}
                              placeholder="123 Main Street"
                              disabled={!useNewAddress && selectedAddressId !== ""}
                            />
                            {errors.address && 
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                            }
                          </div>
                          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div>
                            <label htmlFor="city" className="block text-amber-500 font-medium mb-2">
                              City
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full bg-neutral-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  errors.city ? "border-red-500" : "border-neutral-700 hover:border-neutral-600"
                                }`}
                                placeholder="New York"
                                disabled={!useNewAddress && selectedAddressId !== ""}
                              />
                              {errors.city && 
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              }
                            </div>
                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-amber-500 font-medium mb-2">
                              State
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full bg-neutral-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  errors.state ? "border-red-500" : "border-neutral-700 hover:border-neutral-600"
                                }`}
                                placeholder="NY"
                                disabled={!useNewAddress && selectedAddressId !== ""}
                              />
                              {errors.state && 
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              }
                            </div>
                            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="zip" className="block text-amber-500 font-medium mb-2">
                              ZIP Code
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                id="zip"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className={`w-full bg-neutral-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  errors.zip ? "border-red-500" : "border-neutral-700 hover:border-neutral-600"
                                }`}
                                placeholder="10001"
                                disabled={!useNewAddress && selectedAddressId !== ""}
                              />
                              {errors.zip && 
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                </div>
                              }
                            </div>
                            {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip}</p>}
                          </div>
                        </div>

                        <div className="mb-8">
                          <label htmlFor="country" className="block text-amber-500 font-medium mb-2">
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 text-white border border-neutral-700 hover:border-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled={!useNewAddress && selectedAddressId !== ""}
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </>
                    )}
                    
                    {/* Display selected address summary if using saved address */}
                    {!useNewAddress && selectedAddressId && (
                      <div className="bg-neutral-800/70 p-4 rounded-lg border border-neutral-700">
                        <p className="text-gray-300">You'll be shipping to your saved address. You can change this by selecting "Enter a new address" above.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-8 border-t border-neutral-800 pt-6">
                    <h3 className="text-lg font-medium text-amber-500 mb-4">Payment Method</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id="payment-paypal"
                          name="paymentMethod"
                          value="PayPal"
                          checked={paymentMethod === "PayPal"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600"
                        />
                        <label htmlFor="payment-paypal" className="flex-grow">
                          <div className={`p-4 rounded-lg cursor-pointer ${
                            paymentMethod === "PayPal"
                              ? "bg-amber-800/30 border border-amber-700/50"
                              : "bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
                          }`}>
                            <div className="font-medium text-white flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              PayPal
                            </div>
                            <p className="text-xs text-gray-400 mt-1 ml-7">Pay securely using your PayPal account or credit card</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id="payment-cod"
                          name="paymentMethod"
                          value="Cash on Delivery"
                          checked={paymentMethod === "Cash on Delivery"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600"
                        />
                        <label htmlFor="payment-cod" className="flex-grow">
                          <div className={`p-4 rounded-lg cursor-pointer ${
                            paymentMethod === "Cash on Delivery"
                              ? "bg-amber-800/30 border border-amber-700/50"
                              : "bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
                          }`}>
                            <div className="font-medium text-white flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Cash on Delivery
                            </div>
                            <p className="text-xs text-gray-400 mt-1 ml-7">Pay with cash when your order is delivered</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-neutral-800 pt-6">
                    <Link 
                      to="/cart" 
                      className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg flex items-center transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Return to Cart
                    </Link>
                    
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed to Payment
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden sticky top-24">
                <div className="p-6 border-b border-neutral-800">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 pb-4 border-b border-neutral-800 group">
                        <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                          <img
                            src={item.images?.[0] || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white group-hover:text-amber-500 transition-colors">{item.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs font-medium bg-neutral-800 text-gray-300 px-2 py-0.5 rounded-full">Size: {item.selectedSize}</span>
                            <span className="ml-2 text-xs font-medium bg-neutral-800 text-gray-300 px-2 py-0.5 rounded-full">Qty: {item.quantity}</span>
                          </div>
                          <div className="flex justify-end items-center mt-2">
                            {item.discount > 0 ? (
                              <div className="flex flex-col items-end">
                                <span className="font-bold text-amber-500">
                                  ${((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-amber-500">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 bg-neutral-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="font-medium text-white">${cartTotal.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Discount ({couponCode})</span>
                        <span className="font-medium text-green-500">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shipping</span>
                      {cartTotal > 100 ? (
                        <span className="font-medium text-green-500">FREE</span>
                      ) : (
                        <span className="font-medium text-white">${(9.99).toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tax (10%)</span>
                      <span className="font-medium text-white">${(cartTotal * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-neutral-700 flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-xl text-amber-500">
                        ${((cartTotal - discountAmount) + (cartTotal > 100 ? 0 : 9.99) + (cartTotal * 0.1)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-800 p-4 rounded-lg flex items-center">
                    <div className="p-2 bg-neutral-700 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">PayPal Secure Checkout</p>
                      <p className="text-xs text-gray-400">
                        You'll be redirected to PayPal after proceeding
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
