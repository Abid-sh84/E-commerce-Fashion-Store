import { useState, useEffect } from "react";
import { getUsers, updateUserRole, deleteUser, createUser, updateUser } from "../../api/admin";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // Add isDeleting state
  const usersPerPage = 10;
  
  // New state variables for user modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    avatar: "",
  });
  const [userFormErrors, setUserFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [users, searchTerm, userTypeFilter, sortField, sortDirection]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply user type filter
    if (userTypeFilter !== "all") {
      if (userTypeFilter === "admin") {
        result = result.filter((user) => user.isAdmin);
      } else if (userTypeFilter === "customers") {
        result = result.filter((user) => !user.isAdmin);
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA, fieldB;

      // Handle date fields
      if (sortField === "createdAt") {
        fieldA = new Date(a.createdAt).getTime();
        fieldB = new Date(b.createdAt).getTime();
      } else if (sortField === "name") {
        fieldA = a.name.toLowerCase();
        fieldB = b.name.toLowerCase();
      } else if (sortField === "email") {
        fieldA = a.email.toLowerCase();
        fieldB = b.email.toLowerCase();
      } else {
        fieldA = a[sortField];
        fieldB = b[sortField];
      }

      // Determine sort direction
      if (sortDirection === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, set the new field and default to desc
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;

    return (
      <span className="ml-1">
        {sortDirection === "asc" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  const handleToggleAdminRole = async (userId, currentAdminStatus) => {
    try {
      await updateUserRole(userId, !currentAdminStatus);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isAdmin: !currentAdminStatus } : user
        )
      );
      
      setActionSuccess(`User role updated successfully`);
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Set loading state
      setIsDeleting(true);
      setError(null);
      
      // Log token for debugging
      console.log('Attempting to delete user with ID:', userId);
      
      // Make delete request
      await deleteUser(userId);
      
      // Update local state by removing the user
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      setConfirmDelete(null);
      
      setActionSuccess("User deleted successfully");
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
      
      // Provide more specific error message based on status code
      if (error.response && error.response.status === 401) {
        setError("Authentication error: You may need to log out and log in again.");
      } else if (error.response && error.response.status === 403) {
        setError("Permission denied: You don't have admin permissions to delete users.");
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(`Failed to delete user: ${error.response.data.message}`);
      } else {
        setError("Failed to delete user. Please try again.");
      }
      
      // Close the dialog after showing the error
      setTimeout(() => setConfirmDelete(null), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleAddUser = () => {
    // Reset form and set to add mode
    setUserForm({
      name: "",
      email: "",
      password: "",
      isAdmin: false,
      avatar: ""
    });
    setUserFormErrors({});
    setIsEditMode(false);
    setCurrentUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    // Set form with user data and set to edit mode
    setUserForm({
      name: user.name,
      email: user.email,
      password: "", // Don't populate password field
      isAdmin: user.isAdmin,
      avatar: user.avatar || ""
    });
    setUserFormErrors({});
    setIsEditMode(true);
    setCurrentUser(user);
    setShowUserModal(true);
  };

  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm({
      ...userForm,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (userFormErrors[name]) {
      setUserFormErrors({
        ...userFormErrors,
        [name]: ""
      });
    }
  };

  const validateUserForm = () => {
    const errors = {};
    
    if (!userForm.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!userForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      errors.email = "Email is invalid";
    }
    
    // Only require password for new users
    if (!isEditMode && !userForm.password) {
      errors.password = "Password is required for new users";
    } else if (userForm.password && userForm.password.length < 6 && userForm.password.length > 0) {
      errors.password = "Password must be at least 6 characters";
    }
    
    return errors;
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateUserForm();
    if (Object.keys(formErrors).length > 0) {
      setUserFormErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        // Update existing user
        const userData = {
          name: userForm.name,
          email: userForm.email,
          isAdmin: userForm.isAdmin,
        };
        
        // Only include password if it was provided
        if (userForm.password) {
          userData.password = userForm.password;
        }
        
        // Only include avatar if it was provided
        if (userForm.avatar) {
          userData.avatar = userForm.avatar;
        }
        
        const updatedUser = await updateUser(currentUser._id, userData);
        
        // Update users array with the updated user
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === currentUser._id ? {...user, ...updatedUser} : user
          )
        );
        
        setActionSuccess("User updated successfully");
      } else {
        // Create new user
        const newUser = await createUser(userForm);
        
        // Add new user to users array
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        setActionSuccess("User created successfully");
      }
      
      // Close modal and reset form
      setShowUserModal(false);
      setUserForm({
        name: "",
        email: "",
        password: "",
        isAdmin: false,
        avatar: ""
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving user:", error);
      setUserFormErrors({
        submit: error.message || "Failed to save user. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAddUser()}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add User
          </button>
          <div className="text-neutral-400">
            Total: {filteredUsers.length} users
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-300 px-4 py-3 mb-6 rounded-md">
          {actionSuccess}
        </div>
      )}

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="admin">Admins</option>
            <option value="customers">Customers</option>
          </select>
          <button
            onClick={fetchUsers}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="spinner h-12 w-12 border-4 border-t-4 border-neutral-800 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No Users Found</h3>
          <p className="text-neutral-400">
            {searchTerm || userTypeFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "There are no users in the system yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("createdAt")}
                  >
                    Joined {getSortIcon("createdAt")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-neutral-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar || "/images/avatars/default.png"}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-white">{user.name}</div>
                          {user.authProvider && user.authProvider !== "local" && (
                            <div className="text-xs text-neutral-400">
                              Via {user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isAdmin
                          ? "bg-purple-900/30 text-purple-400 border border-purple-700/40"
                          : "bg-blue-900/30 text-blue-400 border border-blue-700/40"
                      }`}>
                        {user.isAdmin ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-500 hover:text-blue-400 mr-3"
                        title="Edit user"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleAdminRole(user._id, user.isAdmin)}
                        className={`mr-3 ${
                          user.isAdmin
                            ? "text-red-500 hover:text-red-400"
                            : "text-purple-500 hover:text-purple-400"
                        }`}
                        title={user.isAdmin ? "Remove admin role" : "Make admin"}
                      >
                        {user.isAdmin ? "Demote" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user._id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete user"
                      >
                        Delete
                      </button>

                      {/* Delete confirmation dialog */}
                      {confirmDelete === user._id && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                          <div className="absolute inset-0 bg-black/70" onClick={() => !isDeleting && setConfirmDelete(null)}></div>
                          <div className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md mx-4 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white mb-4">Delete User</h3>
                            <p className="text-neutral-300 mb-6">
                              Are you sure you want to delete the user <span className="font-semibold text-white">{user.name}</span>? 
                              This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => setConfirmDelete(null)}
                                disabled={isDeleting}
                                className={`px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md ${
                                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md flex items-center"
                              >
                                {isDeleting ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                  </>
                                ) : (
                                  'Delete User'
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "text-neutral-500 cursor-not-allowed"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number + 1
                        ? "bg-blue-700 text-white"
                        : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "text-neutral-500 cursor-not-allowed"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowUserModal(false)}></div>
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-lg z-10 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6">
              {isEditMode ? "Edit User" : "Add New User"}
            </h3>
            
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              onClick={() => setShowUserModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Form error */}
            {userFormErrors.submit && (
              <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-md mb-6">
                {userFormErrors.submit}
              </div>
            )}
            
            {/* User form */}
            <form onSubmit={handleUserFormSubmit}>
              <div className="space-y-5">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userForm.name}
                    onChange={handleUserFormChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 p-3"
                    placeholder="Enter full name"
                  />
                  {userFormErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{userFormErrors.name}</p>
                  )}
                </div>
                
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 p-3"
                    placeholder="user@example.com"
                  />
                  {userFormErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{userFormErrors.email}</p>
                  )}
                </div>
                
                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password {isEditMode && <span className="text-neutral-500">(Leave blank to keep current password)</span>}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={userForm.password}
                    onChange={handleUserFormChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 p-3"
                    placeholder={isEditMode ? "Leave blank to keep current" : "Enter password"}
                  />
                  {userFormErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{userFormErrors.password}</p>
                  )}
                </div>
                
                {/* Avatar URL field */}
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-1">
                    Avatar URL <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={userForm.avatar}
                    onChange={handleUserFormChange}
                    className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 p-3"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                
                {/* Admin role checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    checked={userForm.isAdmin}
                    onChange={handleUserFormChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-300">
                    Admin privileges
                  </label>
                </div>
                
                {/* Form actions */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>{isEditMode ? 'Update User' : 'Create User'}</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersPage;
