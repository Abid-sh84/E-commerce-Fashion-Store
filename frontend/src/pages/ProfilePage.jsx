// Import needed hooks and components
"use client"

import { useState, useEffect, lazy, Suspense, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { getUserOrders } from "../api/orders" // Import the API function for getting user orders
import { useRecentlyViewed } from "../contexts/RecentlyViewedContext"
import { useCart } from "../contexts/CartContext" // Import useCart hook
import axios from "axios"
import { API_URL, API_BASE_URL } from '../api/config';
import { useWishlist } from "../contexts/WishlistContext";
import { removeFromWishlist as apiRemoveFromWishlist } from "../api/user"; // Import only the functions that exist

const RecentlyViewedProducts = lazy(() => import("../components/RecentlyViewedProducts"))

const avatars = [
  { id: 1, name: "Superman", image: "https://tse1.mm.bing.net/th/id/OIP.PKMxKaVtp0t5pCSpA-eIcQHaLH?rs=1&pid=ImgDetMain" },
  { id: 2, name: "Batman", image: "https://comicvine.gamespot.com/a/uploads/original/11125/111253442/4897645-batman.jpg " },
  { id: 3, name: "Spider-Man", image: "https://4kwallpapers.com/images/wallpapers/marvels-spider-man-2048x2048-13495.jpg" },
  { id: 4, name: "Wonder Woman", image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7a3e204f-65f8-4a69-a257-052f82738fd8/dfcsoxq-b87b8d58-4209-45f4-9516-4d2c8cffd5f3.png/v1/fill/w_512,h_768,q_80,strp/wonder_woman_closeup_by_digitaltoadphotos_dfcsoxq-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzY4IiwicGF0aCI6IlwvZlwvN2EzZTIwNGYtNjVmOC00YTY5LWEyNTctMDUyZjgyNzM4ZmQ4XC9kZmNzb3hxLWI4N2I4ZDU4LTQyMDktNDVmNC05NTE2LTRkMmM4Y2ZmZDVmMy5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.P_hg4D87brx4wR7pRTixxvObudv_uUXJf8kPLIqk8Lo" },
  { id: 5, name: "Iron Man", image: "https://img.freepik.com/premium-photo/iron-man-avenger-illustrated-vector-design_973047-59436.jpg" },
  { id: 6, name: "Captain America", image: "https://img.freepik.com/premium-vector/captain-america-mascot-esports-gaming-logo-design-marvel-world-illustration_196854-1784.jpg?w=2000" },
  { id: 7, name: "Black Widow", image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9f3f9bd9-0673-4276-bb34-71ece2a5820e/dfm8yq2-1f994f89-0b81-4328-b6a3-2b4a18992ec3.png/v1/fill/w_1920,h_1920,q_80,strp/black_widow__ai_art__by_3d1viner_dfm8yq2-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTkyMCIsInBhdGgiOiJcL2ZcLzlmM2Y5YmQ5LTA2NzMtNDI3Ni1iYjM0LTcxZWNlMmE1ODIwZVwvZGZtOHlxMi0xZjk5NGY4OS0wYjgxLTQzMjgtYjZhMy0yYjRhMTg5OTJlYzMucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.XCjlX2_xBjdo0--C_MaVBETCkwT5_dslWEPVonbhkJE" },
  { id: 8, name: "Hulk", image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/69b81377-6df1-4562-821d-f771093cc41e/dfvdt4f-f3f83cd4-9b4c-481e-b149-7d714595d449.jpg/v1/fill/w_894,h_894,q_70,strp/incredible_hulk_portrait_by_monsterdesignz80_dfvdt4f-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY5YjgxMzc3LTZkZjEtNDU2Mi04MjFkLWY3NzEwOTNjYzQxZVwvZGZ2ZHQ0Zi1mM2Y4M2NkNC05YjRjLTQ4MWUtYjE0OS03ZDcxNDU5NWQ0NDkuanBnIiwiaGVpZ2h0IjoiPD0xOTIwIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvNjliODEzNzctNmRmMS00NTYyLTgyMWQtZjc3MTA5M2NjNDFlXC9tb25zdGVyZGVzaWduejgwLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.F7S5lwS2sNLP9OQP6qu8kX8NRmxovHKKUp8GqiT55x0" },
  { id: 9, name: "Thor", image: "https://cdn.midjourney.com/9f322c04-85bc-438b-9ee8-29d40bf8a643/0_1.webp" },
  { id: 10, name: "Captain Marvel", image: "https://wallpaperaccess.com/full/2705874.jpg" },
  { id: 11, name: "Wolverine", image: "https://tse4.mm.bing.net/th/id/OIP.8203R96K4N8L5528rC5mhwHaHa?rs=1&pid=ImgDetMain" },
  { id: 12, name: "Doctor Strange", image: "https://tse3.mm.bing.net/th/id/OIP.3sG7TymeOJ6TF-1X3em4JAHaHa?rs=1&pid=ImgDetMain" }
]

const DEFAULT_AVATAR = "https://res.cloudinary.com/dkmakj50l/image/upload/v1744447073/superman_avatar_geflb0.png"

// Use proper environment variables instead of hardcoded URL
const API_ENDPOINT = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api'

// Address API functions - Updated with correct endpoints to match backend routes
const getAddresses = async () => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`${API_ENDPOINT}/users/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching addresses:", error)
    throw error
  }
}

const addAddress = async (addressData) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.post(`${API_ENDPOINT}/users/addresses`, addressData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error adding address:", error)
    throw error
  }
}

const updateAddress = async (id, addressData) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.put(`${API_ENDPOINT}/users/addresses/${id}`, addressData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error updating address:", error)
    throw error
  }
}

const deleteAddress = async (id) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.delete(`${API_ENDPOINT}/users/addresses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error deleting address:", error)
    throw error
  }
}

const setDefaultAddress = async (id) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.put(`${API_ENDPOINT}/users/addresses/${id}/default`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error setting default address:", error)
    throw error
  }
}

const ProfilePage = () => {
  const { currentUser, logout, updateUserAvatar, updateUserProfile, updateUserPassword } = useAuth()
  const { recentlyViewedItems } = useRecentlyViewed() // We only need the items, no syncing needed
  const { wishlistItems, isLoading: wishlistLoading, error: wishlistError, refresh: fetchWishlistItems } = useWishlist()
  const { addToCart } = useCart() // Get addToCart function from the CartContext
  const navigate = useNavigate()
  const modalRef = useRef(null)
  const avatarModalRef = useRef(null) // New ref for avatar modal

  const [activeTab, setActiveTab] = useState("profile")
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || DEFAULT_AVATAR)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showStars, setShowStars] = useState(false) // Turned off by default now
  const [isLoading, setIsLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false) // New state for avatar modal
  
  // Address states
  const [addresses, setAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [addressesError, setAddressesError] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [currentAddress, setCurrentAddress] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '', // Added phone field
    isDefault: false
  })
  const [formErrors, setFormErrors] = useState({})
  const [addressActionLoading, setAddressActionLoading] = useState(false)

  // Replace dummy orders array with a state for real orders
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "")
      setEmail(currentUser.email || "")
      setSelectedAvatar(currentUser.avatar || DEFAULT_AVATAR)
    }
  }, [currentUser])

  // Add a new effect to fetch orders when activeTab is "orders"
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "addresses") {
      fetchAddresses();
    } else if (activeTab === "wishlist") {
      fetchWishlistItems();
    }
  }, [activeTab]);
  
  // Function to fetch addresses from API
  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true)
      setAddressesError(null)
      const fetchedAddresses = await getAddresses()
      setAddresses(fetchedAddresses)
    } catch (error) {
      console.error("Error fetching addresses:", error)
      setAddressesError("Failed to load your addresses. Please try again.")
    } finally {
      setAddressesLoading(false)
    }
  }
  
  // Handle opening the address modal
  const handleAddressModal = (address = null) => {
    if (address) {
      setIsEditMode(true)
      setCurrentAddress(address)
      setAddressForm({
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        phone: address.phone || '', // Added phone field and handle potential undefined value
        isDefault: address.isDefault
      })
    } else {
      setIsEditMode(false)
      setCurrentAddress(null)
      setAddressForm({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        isDefault: false
      })
    }
    setFormErrors({})
    setShowAddressModal(true)
  }
  
  // Handle address form input changes
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }
  
  // Validate address form
  const validateAddressForm = () => {
    const errors = {}
    if (!addressForm.name.trim()) errors.name = 'Address name is required'
    if (!addressForm.street.trim()) errors.street = 'Street address is required'
    if (!addressForm.city.trim()) errors.city = 'City is required'
    if (!addressForm.state.trim()) errors.state = 'State/Province is required'
    if (!addressForm.zip.trim()) errors.zip = 'ZIP/Postal code is required'
    if (!addressForm.country.trim()) errors.country = 'Country is required'
    if (!addressForm.phone.trim()) errors.phone = 'Phone number is required'
    return errors
  }
  
  // Handle address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateAddressForm()
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      return
    }
    
    setAddressActionLoading(true)
    
    try {
      if (isEditMode && currentAddress) {
        await updateAddress(currentAddress._id, addressForm)
      } else {
        await addAddress(addressForm)
      }
      
      // Refresh addresses
      await fetchAddresses()
      
      // Close modal and show success
      setShowAddressModal(false)
      
      // Show success toast
      const successToast = document.getElementById('success-toast')
      if (successToast) {
        successToast.textContent = isEditMode ? 'Address updated successfully!' : 'Address added successfully!'
        successToast.classList.remove('hidden')
        setTimeout(() => {
          successToast.classList.add('hidden')
        }, 3000)
      }
    } catch (error) {
      console.error("Address action failed:", error)
      // Show error in form
      setFormErrors({
        submit: `Failed to ${isEditMode ? 'update' : 'add'} address. Please try again.`
      })
    } finally {
      setAddressActionLoading(false)
    }
  }
  
  // Handle setting default address
  const handleSetDefaultAddress = async (id) => {
    try {
      setAddressActionLoading(true)
      await setDefaultAddress(id)
      await fetchAddresses()
      
      // Show success toast
      const successToast = document.getElementById('success-toast')
      if (successToast) {
        successToast.textContent = 'Default address updated!'
        successToast.classList.remove('hidden')
        setTimeout(() => {
          successToast.classList.add('hidden')
        }, 3000)
      }
    } catch (error) {
      console.error("Error setting default address:", error)
    } finally {
      setAddressActionLoading(false)
    }
  }
  
  // Handle deleting address
  const handleDeleteAddress = async (id) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return
    }
    
    try {
      setAddressActionLoading(true)
      await deleteAddress(id)
      await fetchAddresses()
      
      // Show success toast
      const successToast = document.getElementById('success-toast')
      if (successToast) {
        successToast.textContent = 'Address deleted successfully!'
        successToast.classList.remove('hidden')
        setTimeout(() => {
          successToast.classList.add('hidden')
        }, 3000)
      }
    } catch (error) {
      console.error("Error deleting address:", error)
    } finally {
      setAddressActionLoading(false)
    }
  }

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const fetchedOrders = await getUserOrders();
      console.log("Fetched orders:", fetchedOrders);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrdersError("Failed to load your orders. Please try again later.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setPasswordError("")
    
    // Validate password if provided
    if (password) {
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters")
        return
      }
      
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match")
        return
      }
    }
    
    setIsLoading(true)
    
    try {
      await updateUserProfile(name, email)
      
      if (selectedAvatar !== currentUser?.avatar) {
        await updateUserAvatar(selectedAvatar)
      }
      
      if (password.trim() !== "") {
        await updateUserPassword(password)
        setPassword("")
        setConfirmPassword("")
      }
      
      const successToast = document.getElementById('success-toast')
      if (successToast) {
        successToast.classList.remove('hidden')
        setTimeout(() => {
          successToast.classList.add('hidden')
        }, 3000)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentAvatarObject = avatars.find(avatar => avatar.image === selectedAvatar) || 
    { id: 0, name: "Default Hero", image: DEFAULT_AVATAR }

  // Formatting utility for dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get total items count from order items
  const getItemsCount = (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems)) return 0;
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  // Function to get the appropriate status badge class based on order status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Delivered":
        return "bg-green-900/50 text-green-300 border border-green-700/50";
      case "Shipped":
        return "bg-blue-900/50 text-blue-300 border border-blue-700/50";
      case "Cancelled":
        return "bg-red-900/50 text-red-300 border border-red-700/50";
      case "Processing":
      default:
        return "bg-amber-900/50 text-amber-300 border border-amber-700/50";
    }
  };
  
  // Function to handle order deletion (only for cancelled orders)
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order from your history?")) {
      try {
        // Implement API call to delete order
        // For now we'll just filter it from the UI
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        
        // Show success message
        const successToast = document.getElementById('success-toast');
        if (successToast) {
          successToast.textContent = 'Order removed from history';
          successToast.classList.remove('hidden');
          setTimeout(() => {
            successToast.classList.add('hidden');
          }, 3000);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddressModal(false);
      }
    }

    // Bind the event listener
    if (showAddressModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddressModal]);

  // Close avatar modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarModalRef.current && !avatarModalRef.current.contains(event.target)) {
        setShowAvatarModal(false);
      }
    }

    // Bind the event listener
    if (showAvatarModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAvatarModal]);

  // Function to handle avatar selection and close modal
  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar.image);
    setShowAvatarModal(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12">
      <div id="success-toast" className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 hidden z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Profile updated successfully!
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div 
            ref={avatarModalRef} 
            className="bg-neutral-900 rounded-lg shadow-xl border border-neutral-700 w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Choose Your Avatar</h3>
                <button 
                  onClick={() => setShowAvatarModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleSelectAvatar(avatar)}
                    className={`relative overflow-hidden rounded-lg transform transition-all duration-300 ${
                      selectedAvatar === avatar.image
                        ? "ring-2 ring-amber-500 scale-105"
                        : "hover:ring-1 hover:ring-amber-400 hover:scale-102"
                    }`}
                  >
                    <div className="p-4 bg-neutral-800 text-center overflow-hidden group">
                      <div className="relative w-full overflow-hidden rounded-full mb-3 aspect-square">
                        <div className={`absolute inset-0 rounded-full ${selectedAvatar === avatar.image ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30' : ''}`}></div>
                        <img
                          src={avatar.image}
                          alt={avatar.name}
                          className="w-full h-full object-cover rounded-full aspect-square relative z-10 transition-all duration-300 group-hover:scale-110"
                        />
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{avatar.name}</p>
                    </div>
                    {selectedAvatar === avatar.image && (
                      <div className="absolute inset-0 bg-amber-700/20 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-amber-500 drop-shadow-lg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all duration-300 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-300"
                >
                  Select Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div ref={modalRef} className="bg-neutral-900 rounded-lg shadow-xl border border-neutral-700 w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{isEditMode ? 'Edit Address' : 'Add New Address'}</h3>
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddressSubmit}>
                <div className="space-y-4">
                  {/* Address Name */}
                  <div>
                    <label htmlFor="address-name" className="block text-sm font-medium text-gray-300 mb-1">
                      Address Name
                    </label>
                    <input
                      type="text"
                      id="address-name"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      className={`w-full bg-neutral-800 text-white border ${formErrors.name ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3`}
                      placeholder="Home, Work, etc."
                    />
                    {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
                  </div>

                  {/* Street */}
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      className={`w-full bg-neutral-800 text-white border ${formErrors.street ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3`}
                      placeholder="123 Main Street"
                    />
                    {formErrors.street && <p className="mt-1 text-xs text-red-400">{formErrors.street}</p>}
                  </div>

                  {/* Phone number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      className={`w-full bg-neutral-800 text-white border ${formErrors.phone ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3`}
                      placeholder="(123) 456-7890"
                    />
                    {formErrors.phone && <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>}
                  </div>

                  {/* City and State in two columns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        className={`w-full bg-neutral-800 text-white border ${formErrors.city ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3`}
                        placeholder="City"
                      />
                      {formErrors.city && <p className="mt-1 text-xs text-red-400">{formErrors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        className={`w-full bg-neutral-800 text-white border ${formErrors.state ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3`}
                        placeholder="State"
                      />
                      {formErrors.state && <p className="mt-1 text-xs text-red-400">{formErrors.state}</p>}
                    </div>
                  </div>

                  {/* ZIP and Country in two columns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-300 mb-1">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={addressForm.zip}
                        onChange={handleAddressChange}
                        className={`w-full bg-neutral-800 text-white border ${formErrors.zip ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3`}
                        placeholder="ZIP Code"
                      />
                      {formErrors.zip && <p className="mt-1 text-xs text-red-400">{formErrors.zip}</p>}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        className={`w-full bg-neutral-800 text-white border ${formErrors.country ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3`}
                        placeholder="Country"
                      />
                      {formErrors.country && <p className="mt-1 text-xs text-red-400">{formErrors.country}</p>}
                    </div>
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="flex items-center mt-3">
                    <input
                      id="default-address"
                      name="isDefault"
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600 rounded"
                    />
                    <label htmlFor="default-address" className="ml-3 block text-sm text-gray-300">
                      Set as default shipping address
                    </label>
                  </div>

                  {/* Form Error */}
                  {formErrors.submit && (
                    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
                      <p>{formErrors.submit}</p>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center"
                      disabled={addressActionLoading}
                    >
                      {addressActionLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {isEditMode ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>{isEditMode ? 'Update Address' : 'Add Address'}</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-wider text-center">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Profile</span>
        </h1>
        <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Manage your account, orders, addresses and preferences
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - No changes needed */}
          <div className="md:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500 mb-4">
                    <img
                      src={selectedAvatar || DEFAULT_AVATAR}
                      alt={currentAvatarObject.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h2 className="text-xl font-bold text-white">{name || currentUser?.name || "Your Name"}</h2>
                  <p className="text-gray-400 text-sm">{email || currentUser?.email || "email@example.com"}</p>
                  <p className="text-amber-500 text-xs mt-2 bg-neutral-800 px-3 py-1 rounded-full">Avatar: {currentAvatarObject.name}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === "profile"
                        ? "bg-amber-700 text-white shadow-md"
                        : "text-gray-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === "orders"
                        ? "bg-amber-700 text-white shadow-md"
                        : "text-gray-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
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
                    Orders
                  </button>

                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === "addresses"
                        ? "bg-amber-700 text-white shadow-md"
                        : "text-gray-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Addresses
                  </button>

                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === "wishlist"
                        ? "bg-amber-700 text-white shadow-md"
                        : "text-gray-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Wishlist
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 mt-6 border border-neutral-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 shadow-lg">
              {/* Profile tab - no changes needed */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
                    Your Profile
                  </h2>

                  <form onSubmit={handleSaveProfile}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 pl-10"
                            placeholder="Enter your full name"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 pl-10"
                            placeholder="your.email@example.com"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Avatar
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500">
                            <img
                              src={selectedAvatar || DEFAULT_AVATAR}
                              alt={currentAvatarObject.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-300 mb-2">Current: <span className="text-amber-500">{currentAvatarObject.name}</span></p>
                            <button
                              type="button"
                              onClick={() => setShowAvatarModal(true)}
                              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Change Avatar
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Update Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter new password"
                              className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Leave blank to keep your current password</p>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              id="confirmPassword"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {passwordError && (
                        <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
                          <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{passwordError}</span>
                          </div>
                        </div>
                      )}

                      {/* Communication Preferences */}
                      <div className="border-t border-neutral-800 pt-6 mt-8">
                        <h3 className="text-lg font-medium text-gray-200 mb-3">Notification Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id="email-promo"
                              type="checkbox"
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600 rounded"
                            />
                            <label htmlFor="email-promo" className="ml-3 block text-sm text-gray-300">
                              Email me about promotions and new products
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="order-updates"
                              type="checkbox"
                              defaultChecked={true}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600 rounded"
                            />
                            <label htmlFor="order-updates" className="ml-3 block text-sm text-gray-300">
                              Send order status updates via email
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="newsletter"
                              type="checkbox"
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600 rounded"
                            />
                            <label htmlFor="newsletter" className="ml-3 block text-sm text-gray-300">
                              Subscribe to monthly newsletter
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full flex justify-center items-center py-3 px-6 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md relative"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Updating Profile...
                            </>
                          ) : (
                            <>Update Profile</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders tab - updated with color-coded statuses */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
                    Your Orders
                  </h2>

                  {ordersLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="spinner h-10 w-10 border-4 border-t-4 border-neutral-800 border-t-amber-500 rounded-full animate-spin"></div>
                    </div>
                  ) : ordersError ? (
                    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                      <p>{ordersError}</p>
                      <button 
                        onClick={fetchOrders}
                        className="mt-2 text-sm underline hover:text-red-200"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : orders.length > 0 ? (
                    <div>
                      {/* Desktop view - Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-amber-800/30">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                                Order ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                                Items
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                                Total
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-neutral-900/80 divide-y divide-amber-800/20">
                            {orders.map((order) => (
                              <tr key={order._id} className="hover:bg-neutral-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                  #{order._id.substring(order._id.length - 6)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {getItemsCount(order.orderItems)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  ${order.totalPrice?.toFixed(2) || "0.00"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      getStatusBadgeClass(order.status)
                                    }`}
                                  >
                                    {order.status || "Processing"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                  <Link 
                                    to={`/order/${order._id}`}
                                    className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
                                  >
                                    View Details
                                  </Link>
                                  
                                  {order.status === "Cancelled" && (
                                    <button
                                      onClick={() => handleDeleteOrder(order._id)}
                                      className="text-red-400 hover:text-red-300 transition-colors font-medium ml-3"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Mobile view - Cards */}
                      <div className="grid grid-cols-1 gap-4 md:hidden">
                        {orders.map((order) => (
                          <div 
                            key={order._id} 
                            className="bg-neutral-900 rounded-lg p-4 border border-amber-800/30 hover:border-amber-700/40 hover:bg-neutral-800/50 transition-all"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-bold text-white">#{order._id.substring(order._id.length - 6)}</h3>
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  getStatusBadgeClass(order.status)
                                }`}
                              >
                                {order.status || "Processing"}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <p className="text-amber-400/70">Date</p>
                                <p className="text-white">{formatDate(order.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-amber-400/70">Items</p>
                                <p className="text-white">{getItemsCount(order.orderItems)}</p>
                              </div>
                              <div>
                                <p className="text-amber-400/70">Total</p>
                                <p className="text-white">${order.totalPrice?.toFixed(2) || "0.00"}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <Link 
                                to={`/order/${order._id}`}
                                className="flex-1 py-2 bg-amber-700/50 hover:bg-amber-700/70 text-white rounded-md transition-colors font-medium text-sm text-center"
                              >
                                View Details
                              </Link>
                              
                              {order.status === "Cancelled" && (
                                <button
                                  onClick={() => handleDeleteOrder(order._id)}
                                  className="ml-2 px-3 py-2 bg-red-700/50 hover:bg-red-700/70 text-white rounded-md transition-colors font-medium text-sm"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-neutral-900 rounded-lg border border-amber-800/30">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-700/30 to-amber-500/30 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-amber-400"
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
                      <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                      <p className="text-gray-300 mb-6">You haven't placed any orders yet.</p>
                      <Link to="/products" className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg">
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab - Updated with real functionality */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                      Your Addresses
                    </h2>
                    <button 
                      onClick={() => handleAddressModal()}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-md"
                      disabled={addressActionLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add New Address
                    </button>
                  </div>

                  {/* Loading State */}
                  {addressesLoading && (
                    <div className="flex justify-center items-center py-10">
                      <div className="spinner h-10 w-10 border-4 border-t-4 border-neutral-800 border-t-amber-500 rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Error State */}
                  {addressesError && (
                    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                      <p>{addressesError}</p>
                      <button 
                        onClick={fetchAddresses}
                        className="mt-2 text-sm underline hover:text-red-200"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* No Addresses State */}
                  {!addressesLoading && !addressesError && addresses.length === 0 && (
                    <div className="text-center py-16 bg-neutral-900 rounded-lg border border-amber-800/30">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-700/30 to-amber-500/30 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-amber-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No addresses yet</h3>
                      <p className="text-gray-300 mb-6">Add your first shipping or billing address</p>
                      <button 
                        onClick={() => handleAddressModal()}
                        className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Address
                      </button>
                    </div>
                  )}

                  {/* Address List */}
                  {!addressesLoading && !addressesError && addresses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`relative overflow-hidden bg-neutral-900 rounded-lg p-6 border ${
                            address.isDefault 
                              ? 'border-amber-500/50' 
                              : 'border-neutral-700/50'
                          } transform hover:scale-[1.02] transition-all duration-300 shadow-lg`}
                        >
                          {address.isDefault && (
                            <div className="absolute -right-10 -top-10 w-20 h-20 bg-amber-400/20 rounded-full blur-xl"></div>
                          )}
                          
                          <div className="flex justify-between items-start mb-4 relative">
                            <h3 className="font-bold text-white text-lg">{address.name}</h3>
                            {address.isDefault && (
                              <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="text-gray-300 space-y-2 mb-6 relative">
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state} {address.zip}
                            </p>
                            <p>{address.country}</p>
                          </div>

                          <div className="flex justify-between relative">
                            <div className="space-x-3">
                              <button 
                                className="text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors"
                                onClick={() => handleAddressModal(address)}
                                disabled={addressActionLoading}
                              >
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                  Edit
                                </span>
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address._id)}
                                disabled={addressActionLoading}
                                className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
                              >
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Delete
                                </span>
                              </button>
                            </div>

                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address._id)}
                                disabled={addressActionLoading}
                                className="text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors"
                              >
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 005.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                  </svg>
                                  Set as Default
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
                    Your Wishlist
                  </h2>
                  
                  {wishlistLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="spinner h-10 w-10 border-4 border-t-4 border-neutral-800 border-t-amber-500 rounded-full animate-spin"></div>
                    </div>
                  ) : wishlistError ? (
                    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                      <p>{wishlistError}</p>
                      <button 
                        onClick={fetchWishlistItems}
                        className="mt-2 text-sm underline hover:text-red-200"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : wishlistItems.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                          <div key={item._id || item.id} className="group">
                            <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 transition-all duration-300 hover:border-amber-600">
                              <div className="relative">
                                <Link to={`/product/${item._id || item.id}`}>
                                  <div className="relative overflow-hidden h-64">
                                    <img
                                      src={item.images?.[0] || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60"></div>
                                  </div>
                                </Link>
                                
                                <button
                                  onClick={() => {
                                    apiRemoveFromWishlist(item._id || item.id)
                                      .then(() => {
                                        fetchWishlistItems();
                                      })
                                      .catch(error => {
                                        console.error("Error removing from wishlist:", error);
                                      });
                                  }}
                                  className="absolute top-3 right-3 bg-neutral-800/80 hover:bg-neutral-700 p-2 rounded-full transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-400 hover:text-red-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>

                              <div className="p-5">
                                <Link to={`/product/${item._id || item.id}`} className="block mb-2">
                                  <h3 className="font-bold text-lg text-white group-hover:text-amber-500 transition-colors">{item.name}</h3>
                                </Link>

                                {item.universe && (
                                  <span className="inline-block text-xs font-medium bg-neutral-800 text-gray-300 px-3 py-1 rounded-full">
                                    {item.universe}
                                  </span>
                                )}

                                <div className="flex items-center mt-4">
                                  <div className="flex text-amber-500">
                                    {Array(5).fill(null).map((_, i) => (
                                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < (item.rating || 4) ? 'text-amber-500' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                    <span className="ml-2 text-xs text-gray-400">({item.reviewCount || 0})</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div>
                                    {item.discount > 0 ? (
                                      <div className="flex items-center">
                                        <span className="font-bold text-lg text-amber-500">
                                          ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                                        </span>
                                        <span className="text-gray-500 line-through ml-2 text-sm">${item.price?.toFixed(2)}</span>
                                      </div>
                                    ) : (
                                      <span className="font-bold text-lg text-amber-500">${item.price?.toFixed(2) || "29.99"}</span>
                                    )}
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => {
                                    // Use the useCart context function instead of require
                                    if (addToCart) {
                                      addToCart({
                                        ...item,
                                        quantity: 1,
                                        selectedSize: item.sizes?.[0] || "M"
                                      });
                                      
                                      const successToast = document.getElementById('success-toast');
                                      if (successToast) {
                                        successToast.textContent = 'Item added to cart!';
                                        successToast.classList.remove('hidden');
                                        setTimeout(() => {
                                          successToast.classList.add('hidden');
                                        }, 3000);
                                      }
                                    }
                                  }}
                                  className="w-full mt-4 bg-amber-700 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                  </svg>
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 text-center">
                        <Link to="/products" className="inline-flex items-center px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all">
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
                    </>
                  ) : (
                    <div className="text-center py-16 bg-neutral-900 rounded-lg border border-amber-800/30">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-20 blur-xl"></div>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto text-amber-500 relative"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-white mb-3">Your wishlist is empty!</h3>
                      <p className="text-gray-300 mb-6 max-w-md mx-auto">Save your favorite cosmic collectibles and superhero gear for your next adventure.</p>
                      <Link to="/products" className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Explore Hero Gear
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recently Viewed Section - no changes needed */}
        <section className="mt-16">
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden h-64 animate-pulse">
                  <div className="h-40 bg-neutral-800"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <RecentlyViewedProducts currentProductId={null} showClearButton={true} />
          </Suspense>
        </section>
      </div>
    </div>
  )
}

export default ProfilePage