"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  login as loginApi, 
  register as registerApi, 
  getUserProfile, 
  updateUserProfile as updateProfileApi, 
  initiateGoogleAuth, 
  loginWithGoogle as loginWithGoogleApi
} from '../api/auth'
import axios from 'axios'

// Create context
const AuthContext = createContext({
  currentUser: null, 
  isAuthenticated: false,
  loading: true,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => {},
  updateUserAvatar: () => Promise.resolve(),
  updateUserProfile: () => Promise.resolve(),
  updateUserPassword: () => Promise.resolve(),
  initiateGoogleLogin: () => {},
  loginWithGoogle: () => Promise.resolve(),
});

// Define the provider component as a named function for consistent exports
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const userData = await loginApi(email, password);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  }

  const signup = async (name, email, password) => {
    try {
      const userData = await registerApi(name, email, password);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create account');
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate('/login')
  }

  const updateUserAvatar = async (avatarUrl) => {
    if (currentUser) {
      try {
        console.log('Updating avatar to:', avatarUrl);
        
        // Make API call to update avatar
        const updatedData = await updateProfileApi({ avatar: avatarUrl });
        
        // Update user in state with response from backend
        const updatedUser = {
          ...currentUser,
          avatar: avatarUrl
        };
        
        setCurrentUser(updatedUser);
        
        // Update user in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        return true;
      } catch (error) {
        console.error("Error updating avatar:", error);
        throw error;
      }
    }
  };

  const updateUserProfile = async (name, email) => {
    try {
      console.log('Updating profile with name and email:', { name, email });
      
      // Ensure we have the latest token
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Make API call to update profile
      const updatedData = await updateProfileApi({ name, email });
      
      if (updatedData) {
        // Update current user state with response from backend
        setCurrentUser(prev => ({
          ...prev,
          name: updatedData.name || prev.name,
          email: updatedData.email || prev.email
        }));
        
        // Save to localStorage for persistence
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          name: updatedData.name || userData.name,
          email: updatedData.email || userData.email
        }));
      }
      
      return updatedData;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const updateUserPassword = async (newPassword) => {
    try {
      console.log('Updating password');
      
      // Ensure we have the latest token
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Make API call to update password
      const updatedData = await updateProfileApi({ password: newPassword });
      
      console.log("Password updated successfully");
      
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  const initiateGoogleLogin = () => {
    // Store the current URL to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== "/login" && currentPath !== "/signup") {
      localStorage.setItem("redirectAfterLogin", currentPath);
    }
    
    // Redirect to the backend's Google auth endpoint using the environment variable
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/google`;
  };

  const loginWithGoogle = async (token) => {
    try {
      // Use the imported loginWithGoogleApi function instead of direct fetch
      const userData = await loginWithGoogleApi(token);
      
      // Set authentication state
      setIsAuthenticated(true);
      setCurrentUser(userData);
      
      return userData;
    } catch (error) {
      console.error("Error in Google login process:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateUserAvatar,
    updateUserProfile,
    updateUserPassword,
    initiateGoogleLogin,
    loginWithGoogle,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

// Export the hook separately as a named function
export function useAuth() {
  return useContext(AuthContext);
}
