import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminProfilePage = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Populate form with current user data
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || ''
      }));
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateUserProfile(formData.name, formData.email);
      setSuccessMessage('Profile information updated successfully');
      
      // Set a timeout to clear the success message
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Call your API to update password
      // This would depend on your auth implementation
      // If your updateUserProfile can handle passwords:
      await updateUserProfile(formData.name, formData.email, formData.newPassword);
      
      setSuccessMessage('Password updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Set a timeout to clear the success message
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowPasswordForm(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Profile</h1>
      </div>

      {/* Profile information card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600/30 mb-4">
              <img 
                src={avatar || "/images/placeholder-user.jpg"} 
                alt={currentUser?.name || "Admin"} 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{currentUser?.name}</h2>
            <p className="text-neutral-400 mb-2">{currentUser?.email}</p>
            <div className="bg-blue-900/30 text-blue-400 border border-blue-700/40 px-3 py-1 rounded-full text-xs font-semibold">
              Administrator
            </div>
          </div>
          
          <div className="mt-6 border-t border-neutral-800 pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-400">Name:</span>
                <span className="text-white font-medium">{currentUser?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Email:</span>
                <span className="text-white font-medium">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Role:</span>
                <span className="text-blue-400 font-medium">Administrator</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Joined:</span>
                <span className="text-white font-medium">
                  {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Edit Profile Information</h2>
            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {showPasswordForm ? 'Edit Basic Info' : 'Change Password'}
            </button>
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-900/30 border border-green-700/50 text-green-400 px-4 py-3 rounded-md">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-md">
              {errorMessage}
            </div>
          )}

          {!showPasswordForm ? (
            <form onSubmit={handleBasicInfoSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Additional admin information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Admin Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-white">Manage orders and customers</p>
                <p className="text-neutral-400 text-sm">Process orders and manage customer accounts</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <p className="text-white">Manage products and inventory</p>
                <p className="text-neutral-400 text-sm">Add, edit, or remove products from store</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white">Manage users and permissions</p>
                <p className="text-neutral-400 text-sm">Control access and user roles</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Store Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Current Theme:</span>
              <span className="bg-neutral-800 px-3 py-1 rounded-md text-white">Dark</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Platform Version:</span>
              <span className="text-white">Fashion Store v1.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Last Login:</span>
              <span className="text-white">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Browser:</span>
              <span className="text-white">{navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other'}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-800">
            <button 
              onClick={logout}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;