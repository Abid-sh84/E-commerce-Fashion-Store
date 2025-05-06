import { getUserAddresses } from '../api/user';

/**
 * Get the user's default address
 * @returns {Promise<Object|null>} The default address or null if none exists
 */
export const getDefaultAddress = async () => {
  try {
    const addresses = await getUserAddresses();
    
    // First try to find an address marked as default
    const defaultAddress = addresses.find(addr => addr.isDefault);
    
    // If no default is set but addresses exist, return the first one
    if (!defaultAddress && addresses.length > 0) {
      return addresses[0];
    }
    
    return defaultAddress || null;
  } catch (error) {
    console.error('Error getting default address:', error);
    throw new Error('Failed to get default address');
  }
};

/**
 * Fill the checkout form data with address information
 * @param {Object} address - The address object
 * @param {Function} setFormData - State setter function for form data
 */
export const fillAddressData = (address, setFormData) => {
  if (!address) return;
  
  // Split the name into first and last name if possible
  let firstName = address.name;
  let lastName = '';
  
  if (address.name && address.name.includes(' ')) {
    const nameParts = address.name.split(' ');
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(' ');
  }
  
  setFormData(prevData => ({
    ...prevData,
    firstName,
    lastName,
    address: address.street || '',
    city: address.city || '',
    state: address.state || '',
    zip: address.zip || '',
    country: address.country || 'United States'
  }));
};

/**
 * Validate checkout form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object containing any validation errors
 */
export const validateCheckoutForm = (formData) => {
  const errors = {};

  // Basic validation
  if (!formData.firstName.trim()) errors.firstName = "First name is required";
  if (!formData.lastName.trim()) errors.lastName = "Last name is required";
  if (!formData.email.trim()) errors.email = "Email is required";
  if (!formData.address.trim()) errors.address = "Address is required";
  if (!formData.city.trim()) errors.city = "City is required";
  if (!formData.state.trim()) errors.state = "State is required";
  if (!formData.zip.trim()) errors.zip = "ZIP code is required";

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
};

/**
 * Prepare shipping address data from form data
 * @param {Object} formData - The form data
 * @returns {Object} - Shipping address object ready for API submission
 */
export const prepareShippingAddress = (formData) => {
  return {
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postalCode: formData.zip,
    country: formData.country,
  };
};
