import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import WishlistPage from "./pages/WishlistPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProfilePage from "./pages/ProfilePage"
import CheckoutPage from "./pages/CheckoutPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import GoogleAuthCallback from "./components/GoogleAuthCallback"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import FaqPage from "./pages/FaqPage"
import ShippingPage from "./pages/ShippingPage"
import TermsPage from "./pages/TermsPage"
import ReturnsPage from "./pages/ReturnsPage"
import PrivacyPage from "./pages/PrivacyPage"
import CookiesPage from "./pages/CookiesPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import AdminLayout from "./components/AdminLayout"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminProductsPage from "./pages/admin/AdminProductsPage"
import AdminProductFormPage from "./pages/admin/AdminProductFormPage"
import AdminOrdersPage from "./pages/admin/AdminOrdersPage"
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage"
import AdminUsersPage from "./pages/admin/AdminUsersPage"
import AdminSettingsPage from "./pages/admin/AdminSettingsPage"
import AdminCancellationPage from "./pages/admin/AdminCancellationPage"
import AdminSubscribersPage from "./pages/admin/AdminSubscribersPage"
import AdminCouponsPage from "./pages/admin/AdminCouponsPage"
import AdminReviewsPage from "./pages/admin/AdminReviewsPage"
import VisitorTracker from "./components/VisitorTracker"
import AdminProfilePage from "./pages/admin/AdminProfilePage"

import { CartProvider } from "./contexts/CartContext"
import { WishlistProvider } from "./contexts/WishlistContext"
import { AuthProvider } from "./contexts/AuthContext"
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext"
import { useAuth } from "./contexts/AuthContext"

// Protected route component for admin routes
const AdminRoute = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=admin" replace />;
  }
  
  if (!currentUser?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public layout with Navbar and Footer
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-indigo-950 bg-[url('/images/starry-bg.png')] bg-fixed bg-cover">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="auth/google/callback" element={<GoogleAuthCallback />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            {/* Visitor Tracking Component */}
            <VisitorTracker />
            <Routes>
              {/* Admin Login Route */}
              <Route path="/admin-login" element={<AdminLoginPage />} />
              
              {/* Admin Routes with protection */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                } 
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/edit/:id" element={<AdminProductFormPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
                <Route path="cancellations" element={<AdminCancellationPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="subscribers" element={<AdminSubscribersPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>

              {/* All public routes including home route */}
              <Route path="/*" element={<PublicLayout />} />
            </Routes>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App
