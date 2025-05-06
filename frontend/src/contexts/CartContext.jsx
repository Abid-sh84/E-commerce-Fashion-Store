"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create context with default value
const CartContext = createContext({
  cartItems: [],
  cartTotal: 0,
  discountAmount: 0,
  couponCode: "",
  couponApplied: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  applyCoupon: () => {},
  removeCoupon: () => {},
});

// Export the hook separately
export const useCart = () => useContext(CartContext)

// Define the provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    
    // Load coupon data from localStorage
    const savedCoupon = localStorage.getItem("cartCoupon")
    if (savedCoupon) {
      const couponData = JSON.parse(savedCoupon)
      setDiscountAmount(couponData.discountAmount || 0)
      setCouponCode(couponData.couponCode || "")
      setCouponApplied(couponData.couponApplied || false)
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cartItems))

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
      return sum + price * item.quantity
    }, 0)

    setCartTotal(total)
  }, [cartItems])

  useEffect(() => {
    // Save coupon data to localStorage whenever it changes
    localStorage.setItem("cartCoupon", JSON.stringify({
      discountAmount,
      couponCode,
      couponApplied
    }))
  }, [discountAmount, couponCode, couponApplied])

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize,
      )

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += product.quantity || 1
        return updatedItems
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity: product.quantity || 1 }]
      }
    })
  }

  const removeFromCart = (id, size) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.selectedSize === size)))
  }

  const updateQuantity = (id, size, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id && item.selectedSize === size ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Function to apply a coupon
  const applyCoupon = (code, amount) => {
    setCouponCode(code.toUpperCase());
    setDiscountAmount(amount);
    setCouponApplied(true);
  }

  // Function to remove a coupon
  const removeCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setCouponApplied(false);
  }

  // Update the prepareOrderItems function to correctly send MongoDB ObjectIds
  const prepareOrderItems = () => {
    return cartItems.map(item => {
      // The product field should contain the MongoDB _id, not the simple numeric id
      return {
        product: item._id || item.id, // Use MongoDB _id if available, otherwise fallback to id
        name: item.name,
        image: item.images?.[0] || "",
        price: item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price,
        quantity: item.quantity,
        size: item.selectedSize || "M",
        color: item.selectedColor || ""
      };
    });
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    discountAmount,
    couponCode,
    couponApplied,
    applyCoupon,
    removeCoupon,
    prepareOrderItems
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
