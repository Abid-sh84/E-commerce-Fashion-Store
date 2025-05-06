import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProductById, updateProduct } from "../../api/admin";

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    price: "",
    description: "",
    images: [""],
    category: "",
    universe: "",
    type: "",
    countInStock: "",
    sizes: [],
    discount: 0,
    isNew: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const universes = [
    "Marvel",
    "DC Comics",
    "Anime",
    "Classic Comics",
    "Sci-Fi & Fantasy",
    "Video Games",
    "Custom Fan Art",
  ];

  const productTypes = [
    "Oversized",
    "Acid Wash",
    "Graphic Printed",
    "Solid Color",
    "Polo",
    "Sleeveless",
    "Long Sleeve",
    "Henley",
    "Hooded",
    "Crop Top",
    "T-Shirt",
    "Hoodie",
    "Sweatshirt",
    "Cap",
    "Jacket",
  ];
  
  useEffect(() => {
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);
  
  const fetchProductDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const product = await getProductById(id);
      // Format the data to match our form structure
      setFormData({
        productId: product.productId || "",
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        images: product.images?.length ? product.images : [""],
        category: product.category || "",
        universe: product.universe || "",
        type: product.type || "",
        countInStock: product.countInStock || "",
        sizes: product.sizes || [],
        discount: product.discount || 0,
        isNew: product.isNew || false,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "price" || name === "countInStock" || name === "discount") {
      // Handle numeric inputs
      const numValue = value === "" ? "" : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const currentSizes = [...prev.sizes];
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
  };
  
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };
  
  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };
  
  const removeImageField = (index) => {
    if (formData.images.length <= 1) return;
    
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };
  
  const validateForm = () => {
    const errors = [];
    if (!formData.productId) errors.push("Product ID is required");
    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.price || formData.price <= 0) errors.push("Valid price is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.category.trim()) errors.push("Category is required");
    if (!formData.universe.trim()) errors.push("Universe is required");
    if (!formData.type.trim()) errors.push("Product type is required");
    if (formData.countInStock === "" || formData.countInStock < 0) errors.push("Valid stock count is required");
    if (formData.sizes.length === 0) errors.push("At least one size must be selected");
    
    // Check that all image URLs are valid (not empty if provided)
    const validImages = formData.images.filter(url => url.trim() !== "");
    if (validImages.length === 0) errors.push("At least one product image is required");
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccess("");
    
    try {
      // Filter out empty image URLs
      const filteredImages = formData.images.filter(url => url.trim() !== "");
      const productData = {
        ...formData,
        images: filteredImages
      };
      
      if (isEditMode) {
        await updateProduct(id, productData);
        setSuccess("Product updated successfully!");
      } else {
        const newProduct = await createProduct(productData);
        setSuccess("Product created successfully!");
        // Optional: Redirect to edit page for the new product
        setTimeout(() => {
          navigate(`/admin/products/edit/${newProduct._id}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.response?.data?.message || "Failed to save product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="spinner h-12 w-12 border-4 border-t-4 border-neutral-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          {isEditMode ? "Edit Product" : "Create New Product"}
        </h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/30 border border-green-700/50 text-green-400 px-4 py-3 rounded-md mb-6">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product ID - New field added */}
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-neutral-300 mb-2">
                Product ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-neutral-400 mt-1">
                Enter a unique numeric ID for this product.
              </p>
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Price & Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-300 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-neutral-300 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Category, Universe, Type */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., marvel, dc, anime"
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="universe" className="block text-sm font-medium text-neutral-300 mb-2">
                  Universe <span className="text-red-500">*</span>
                </label>
                <select
                  id="universe"
                  name="universe"
                  value={formData.universe}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Universe</option>
                  {universes.map(universe => (
                    <option key={universe} value={universe}>{universe}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-neutral-300 mb-2">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  {productTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Stock & Is New */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="countInStock" className="block text-sm font-medium text-neutral-300 mb-2">
                  Stock Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="countInStock"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer mt-8">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-neutral-700 bg-neutral-800"
                  />
                  <span className="text-sm font-medium text-neutral-300">Mark as New Arrival</span>
                </label>
              </div>
            </div>
            
            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Available Sizes <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-md focus:outline-none ${
                      formData.sizes.includes(size)
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 bg-neutral-800 border border-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="text-red-500 hover:text-red-400"
                      disabled={formData.images.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center text-blue-500 hover:text-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Another Image
                </button>
              </div>
            </div>
            
            {/* Image Previews */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Image Previews</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.images.map((image, index) => (
                  image.trim() ? (
                    <div 
                      key={index} 
                      className="aspect-square overflow-hidden rounded-md border border-neutral-700"
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                  ) : (
                    <div key={index} className="aspect-square bg-neutral-800 flex items-center justify-center text-neutral-500 rounded-md border border-neutral-700">
                      No preview
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-8 border-t border-neutral-800 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md flex items-center"
          >
            {isSaving && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isEditMode ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
