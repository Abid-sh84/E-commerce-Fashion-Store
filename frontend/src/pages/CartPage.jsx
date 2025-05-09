"use client"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useState } from "react"
import apiClient from "../api/client"

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    discountAmount, 
    couponCode, 
    couponApplied, 
    applyCoupon, 
    removeCoupon 
  } = useCart()
  const [couponInput, setCouponInput] = useState("")
  const [couponMessage, setCouponMessage] = useState("")
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const navigate = useNavigate()
  
  // Calculate cart subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.discount > 0 
      ? item.price * (1 - item.discount / 100) 
      : item.price
    return total + (itemPrice * item.quantity)
  }, 0)
  
  // Shipping cost
  const shippingCost = subtotal > 100 ? 0 : 9.99
  
  // Total cost
  const totalCost = subtotal + shippingCost - discountAmount

  const handleRemoveItem = (id, size) => {
    removeFromCart(id, size)
  }

  const handleQuantityChange = (id, size, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(id, size, newQuantity)
    }
  }

  const handleApplyCoupon = async () => {
    // Reset coupon message and set loading state
    setCouponMessage("")
    setIsValidatingCoupon(true)
    
    try {
      // Call the correct coupon validation endpoint
      const response = await apiClient.post('/coupons/validate', { 
        code: couponInput.trim().toUpperCase(),
        cartTotal: subtotal,
        cartItems: cartItems.map(item => ({
          product: item.id,
          price: item.price,
          qty: item.quantity
        }))
      })
      
      // If the coupon is valid, apply the discount
      if (response.data.valid) {
        // Log coupon details for debugging
        console.log('Coupon response:', response.data);
        
        // Apply the coupon using our shared context
        applyCoupon(couponInput, response.data.discountAmount);
        
        // Display the actual discount percentage from the API
        const discountPercentage = response.data.discount;
        setCouponMessage(`${discountPercentage}% discount applied successfully!`);
      } else {
        setCouponMessage(response.data.message || "Invalid coupon code")
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      setCouponMessage(error.response?.data?.message || "Invalid coupon code")
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-dvh bg-neutral-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl font-bold text-center text-white mb-4 uppercase tracking-wider">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Cart</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-center text-gray-400 mb-12">Your shopping cart is empty</p>

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
            <p className="text-gray-400 mb-8">Add products to your cart and start shopping.</p>
            <Link to="/products" className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-12">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 uppercase tracking-wider">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Cart</span>
            </h1>
            <div className="h-0.5 w-24 bg-amber-500 mb-4 mx-auto md:mx-0"></div>
            <p className="text-gray-400">Review your items and proceed to checkout</p>
          </div>
          <button 
            onClick={clearCart} 
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center space-x-2 transition-colors border border-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-neutral-800">
                <h2 className="text-lg sm:text-xl font-bold text-white">Cart Items ({cartItems.length})</h2>
              </div>
              
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="p-3 sm:p-4 border-b border-neutral-800 group hover:bg-neutral-800/30 transition-colors">
                  <div className="flex sm:flex-row items-start gap-3">
                    <div className="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 relative overflow-hidden rounded-lg bg-neutral-800">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                    
                    <div className="ml-3 sm:ml-4 md:ml-6 flex-1">
                      <div className="flex justify-between">
                        <div className="text-left mb-2 sm:mb-0 flex-1 max-w-[65%]">
                          <Link to={`/product/${item.id}`}>
                            <h3 className="text-sm sm:text-base font-medium text-white group-hover:text-amber-500 transition-colors line-clamp-2 break-words">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="mt-1 flex items-start flex-wrap gap-1">
                            <span className="text-xs text-gray-400 inline-flex items-center">
                              <span className="font-medium mr-1">Size:</span> {item.selectedSize || "M"}
                            </span>
                            {item.selectedColor && (
                              <span className="text-xs text-gray-400 inline-flex items-center ml-1">
                                <span className="font-medium mr-1">Color:</span> {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="sm:mt-0 mb-2 sm:mb-0 text-right ml-auto">
                          {item.discount > 0 ? (
                            <div className="flex flex-col items-start sm:items-end">
                              <span className="font-bold text-sm sm:text-base text-amber-500 whitespace-nowrap">
                                ${((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-500 line-through whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <span className="text-xs text-green-500 mt-0.5 whitespace-nowrap">
                                Save ${(item.price * item.discount / 100 * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-sm sm:text-base text-amber-500 whitespace-nowrap">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-row items-center justify-between gap-2">
                        <div className="flex items-center touch-manipulation">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity - 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-l-md bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 active:bg-neutral-600"
                            disabled={item.quantity <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <div className="w-8 h-7 sm:w-10 sm:h-8 bg-neutral-800 border-y border-neutral-700 text-white flex items-center justify-center text-sm">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-r-md bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 active:bg-neutral-600"
                            disabled={item.quantity >= 10}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                          className="text-red-400 hover:text-red-300 transition-colors px-2 py-1 border border-neutral-800 rounded-md hover:bg-neutral-800"
                          aria-label="Remove item"
                        >
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="ml-1 text-xs sm:text-sm">Remove</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link to="/products" className="inline-flex items-center px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all border border-neutral-700 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="font-medium text-green-500">FREE</span>
                    ) : (
                      <span className="font-medium text-white">${shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Discount ({couponCode.toUpperCase()})</span>
                      <span className="font-medium text-green-500">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-neutral-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-xl font-bold text-amber-500">${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {!couponApplied && (
                  <div className="mt-4 sm:mt-6">
                    <label htmlFor="coupon" className="block text-sm font-medium text-gray-400 mb-2">
                      Have a coupon code?
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                      <input
                        type="text"
                        id="coupon"
                        placeholder="Enter code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-md sm:rounded-l-md sm:rounded-r-none px-4 py-3 sm:py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 sm:py-2 rounded-md sm:rounded-l-none sm:rounded-r-md transition-colors font-medium"
                        disabled={isValidatingCoupon}
                      >
                        {isValidatingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Try one of our available coupons from the admin panel</p>
                    {couponMessage && (
                      <p className={`text-xs mt-1 ${couponApplied ? 'text-green-500' : 'text-red-500'}`}>
                        {couponMessage}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="mt-4 sm:mt-6">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 sm:py-3 px-4 rounded-md transition-all flex items-center justify-center text-base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Proceed to Checkout
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-sm">We accept</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <div className="w-10 h-6 bg-neutral-800 rounded-md flex items-center justify-center px-2">
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"></div>
                    </div>
                    <div className="w-10 h-6 bg-neutral-800 rounded-md flex items-center justify-center px-2">
                      <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-sm"></div>
                    </div>
                    <div className="w-10 h-6 bg-neutral-800 rounded-md flex items-center justify-center px-2">
                      <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Badge */}
            <div className="mt-6 bg-neutral-900 rounded-lg border border-neutral-800 p-4 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-gray-400">Secure Checkout - 256-bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage