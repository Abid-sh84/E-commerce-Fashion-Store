import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api/config';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../api/admin';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discount: 10,
    minAmount: 0,
    maxUses: 0,
    expiryDate: '',
    active: true,
    description: '',
    isGlobal: true,
    applicableCategories: []
  });
  
  // Modal state for edit/delete
  const [isEditing, setIsEditing] = useState(false);
  const [currentCouponId, setCurrentCouponId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  useEffect(() => {
    fetchCoupons();
    fetchCategories();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (error) {
      setError(error.message || 'Failed to fetch coupons');
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/coupons/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoryChange = (categoryName) => {
    const updatedCategories = [...formData.applicableCategories];
    
    if (updatedCategories.includes(categoryName)) {
      // Remove category if already selected
      const index = updatedCategories.indexOf(categoryName);
      updatedCategories.splice(index, 1);
    } else {
      // Add category if not selected
      updatedCategories.push(categoryName);
    }
    
    setFormData({
      ...formData,
      applicableCategories: updatedCategories
    });
  };

  const handleGlobalChange = (e) => {
    const isGlobal = e.target.checked;
    setFormData({
      ...formData,
      isGlobal,
      // Clear applicable categories if global is true
      applicableCategories: isGlobal ? [] : formData.applicableCategories
    });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount: 10,
      minAmount: 0,
      maxUses: 0,
      expiryDate: '',
      active: true,
      description: '',
      isGlobal: true,
      applicableCategories: []
    });
    setIsEditing(false);
    setCurrentCouponId(null);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      resetForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentCouponId) {
        // Update existing coupon
        await updateCoupon(currentCouponId, formData);
      } else {
        // Create new coupon
        await createCoupon(formData);
      }
      
      // Refresh coupons list and reset form
      fetchCoupons();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError(error.message || 'Failed to save coupon');
      console.error('Error saving coupon:', error);
    }
  };

  const handleEdit = (coupon) => {
    // Format date for input element
    let formattedExpiryDate = '';
    if (coupon.expiryDate) {
      const date = new Date(coupon.expiryDate);
      formattedExpiryDate = date.toISOString().split('T')[0];
    }
    
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      minAmount: coupon.minAmount || 0,
      maxUses: coupon.maxUses || 0,
      expiryDate: formattedExpiryDate,
      active: coupon.active,
      description: coupon.description || '',
      isGlobal: coupon.isGlobal !== undefined ? coupon.isGlobal : true,
      applicableCategories: coupon.applicableCategories || []
    });
    
    setIsEditing(true);
    setCurrentCouponId(coupon._id);
    setShowForm(true);
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    
    try {
      await deleteCoupon(couponToDelete._id);
      fetchCoupons();
      setShowDeleteModal(false);
      setCouponToDelete(null);
    } catch (error) {
      setError(error.message || 'Failed to delete coupon');
      console.error('Error deleting coupon:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if a coupon is expired
  const isExpired = (coupon) => {
    if (!coupon.expiryDate) return false;
    return new Date(coupon.expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Coupons Management</h1>
        <button
          onClick={toggleForm}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md flex items-center"
        >
          {showForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Coupon
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700/30 text-red-400 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="code">
                  Coupon Code*
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. SUMMER20"
                  required
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Code will be automatically converted to uppercase
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="discount">
                  Discount Percentage*
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="minAmount">
                  Minimum Purchase Amount
                </label>
                <input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for no minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="maxUses">
                  Maximum Uses
                </label>
                <input
                  type="number"
                  id="maxUses"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for unlimited uses
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="expiryDate">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank for no expiry
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="description">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Summer Sale Discount"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-400">
                    Active
                  </label>
                </div>
              </div>

              {/* Category restriction section */}
              <div className="md:col-span-2 border-t border-neutral-800 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Category Restrictions</h3>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isGlobal"
                      name="isGlobal"
                      checked={formData.isGlobal}
                      onChange={handleGlobalChange}
                      className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="isGlobal" className="ml-2 block text-sm text-gray-400">
                      Apply to all product categories
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    When checked, this coupon will apply to all products regardless of category
                  </p>
                </div>
                
                {!formData.isGlobal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Select applicable categories:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={formData.applicableCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-500"
                          />
                          <label htmlFor={`category-${category}`} className="ml-2 block text-sm text-gray-400">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                    {categories.length === 0 && (
                      <p className="text-sm text-gray-500">No categories found</p>
                    )}
                    {formData.applicableCategories.length === 0 && !formData.isGlobal && (
                      <p className="text-sm text-yellow-500 mt-2">
                        You must select at least one category when not applying to all products
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.isGlobal && formData.applicableCategories.length === 0}
                  className={`px-4 py-2 bg-amber-600 text-white rounded-md ${
                    (!formData.isGlobal && formData.applicableCategories.length === 0)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-amber-700'
                  }`}
                >
                  {isEditing ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-xl font-bold text-white">All Coupons</h2>
        </div>
        
        {coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No coupons found</p>
            <button
              onClick={toggleForm}
              className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md"
            >
              Create Your First Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Min Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Uses / Max
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-neutral-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {coupon.discount}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {coupon.minAmount > 0 ? `$${coupon.minAmount.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {coupon.uses} {coupon.maxUses > 0 ? `/ ${coupon.maxUses}` : '/ ∞'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${!coupon.active 
                          ? 'bg-neutral-900/30 text-gray-400' 
                          : isExpired(coupon)
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-green-900/30 text-green-400'
                        }`}
                      >
                        {!coupon.active 
                          ? 'Inactive' 
                          : isExpired(coupon)
                            ? 'Expired'
                            : 'Active'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {coupon.isGlobal 
                        ? <span className="text-blue-400">Global</span> 
                        : (
                          <div className="group relative">
                            <span className="text-pink-400 cursor-pointer border-b border-dotted border-pink-400">
                              Category-specific
                            </span>
                            <div className="absolute z-10 hidden group-hover:block bg-neutral-800 p-2 rounded shadow-lg min-w-max mt-1">
                              <p className="text-xs text-gray-400 mb-1">Applicable to:</p>
                              <ul className="text-xs text-white">
                                {coupon.applicableCategories && coupon.applicableCategories.map(cat => (
                                  <li key={cat} className="mb-1">{cat}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-amber-500 hover:text-amber-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(coupon)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the coupon <span className="font-bold text-amber-500">{couponToDelete?.code}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;