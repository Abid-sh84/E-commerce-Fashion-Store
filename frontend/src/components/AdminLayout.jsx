import { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Redirect non-admin users
    if (isAuthenticated === false) {
      navigate("/login?redirect=admin");
      return;
    }
    
    if (currentUser && !currentUser.isAdmin) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Function to determine if a nav link is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Get current page name for breadcrumb
  const getCurrentPageName = () => {
    const path = location.pathname.split('/').pop();
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Sidebar */}
      <div className={`bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-y-auto`}>
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          {isSidebarOpen ? (
            <Link to="/admin" className="flex items-center">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Admin Panel
              </span>
            </Link>
          ) : (
            <Link to="/admin" className="flex justify-center w-full">
              <span className="text-xl font-bold text-amber-500">A</span>
            </Link>
          )}
          <button onClick={toggleSidebar} className="text-neutral-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 px-2">
          <Link 
            to="/admin/dashboard" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/dashboard') 
              ? 'bg-amber-800/20 text-amber-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/dashboard') ? 'text-amber-500' : 'text-amber-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link 
            to="/admin/products" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/products') 
              ? 'bg-purple-800/20 text-purple-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/products') ? 'text-purple-500' : 'text-purple-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {isSidebarOpen && <span>Products</span>}
          </Link>
          <Link 
            to="/admin/orders" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/orders') 
              ? 'bg-blue-800/20 text-blue-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/orders') ? 'text-blue-500' : 'text-blue-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {isSidebarOpen && <span>Orders</span>}
          </Link>
          <Link 
            to="/admin/cancellations" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/cancellations') 
              ? 'bg-red-800/20 text-red-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/cancellations') ? 'text-red-500' : 'text-red-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {isSidebarOpen && <span>Cancellations</span>}
          </Link>
          <Link 
            to="/admin/users" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/users') 
              ? 'bg-green-800/20 text-green-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/users') ? 'text-green-500' : 'text-green-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {isSidebarOpen && <span>Users</span>}
          </Link>
          <Link 
            to="/admin/subscribers" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/subscribers') 
              ? 'bg-cyan-800/20 text-cyan-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/subscribers') ? 'text-cyan-500' : 'text-cyan-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isSidebarOpen && <span>Subscribers</span>}
          </Link>
          
          {/* Coupon Management Link */}
          <Link 
            to="/admin/coupons" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/coupons') 
              ? 'bg-pink-800/20 text-pink-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/coupons') ? 'text-pink-500' : 'text-pink-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            {isSidebarOpen && <span>Coupons</span>}
          </Link>
          
          {/* Review Management Link */}
          <Link 
            to="/admin/reviews" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/reviews') 
              ? 'bg-yellow-800/20 text-yellow-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/reviews') ? 'text-yellow-500' : 'text-yellow-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {isSidebarOpen && <span>Reviews</span>}
          </Link>
          
          <Link 
            to="/admin/settings" 
            className={`group flex items-center px-2 py-3 rounded-md mb-1 ${
              isActive('/admin/settings') 
              ? 'bg-red-800/20 text-red-500' 
              : 'text-white hover:bg-neutral-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive('/admin/settings') ? 'text-red-500' : 'text-red-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {isSidebarOpen && <span>Settings</span>}
          </Link>
          
          {/* View Store link */}
          <div className="mt-6 px-2">
            <Link 
              to="/" 
              className="flex items-center text-neutral-400 hover:text-white px-2 py-3 rounded-md"
              target="_blank"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {isSidebarOpen && <span>View Store</span>}
            </Link>
          </div>
        </nav>
        
        {/* Removed the admin profile and logout section from bottom of sidebar */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-950">
        {/* Header with breadcrumbs and profile dropdown */}
        <header className="bg-neutral-900 border-b border-neutral-800 p-4 flex justify-between items-center sticky top-0 z-10">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/admin" className="text-neutral-400 hover:text-white">
                  Admin
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-neutral-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-amber-500 font-medium">{getCurrentPageName()}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          {/* Profile Menu */}
          <div className="relative profile-menu">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleProfile}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-600/40">
                <img 
                  src={currentUser?.avatar || "/images/placeholder-user.jpg"} 
                  alt={currentUser?.name || "Admin"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-white">{currentUser?.name || "Admin"}</div>
                <div className="text-xs text-neutral-400">Administrator</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
                {/* Admin Details */}
                <div className="p-4 border-b border-neutral-700 bg-neutral-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-600/40">
                      <img 
                        src={currentUser?.avatar || "/images/placeholder-user.jpg"} 
                        alt={currentUser?.name || "Admin"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{currentUser?.name}</div>
                      <div className="text-xs text-neutral-400">{currentUser?.email}</div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <Link 
                    to="/admin/profile" 
                    className="block px-4 py-2 text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    My Profile
                  </Link>
                  <Link 
                    to="/admin/settings" 
                    className="block px-4 py-2 text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Main content area - improved overflow handling */}
        <main className="p-6 pb-20 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
