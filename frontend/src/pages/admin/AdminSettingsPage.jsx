import { useState } from "react";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Fashion Store",
    storeEmail: "contact@fashionstore.com",
    customerServiceEmail: "support@fashionstore.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Fashion Avenue, New York, NY 10001"
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@fashionstore.com",
    smtpPassword: "••••••••",
    enableSsl: true,
    fromEmail: "no-reply@fashionstore.com",
    fromName: "Fashion Store"
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    enablePaypal: true,
    enableStripe: true,
    enableCod: true,
    paypalClientId: "sb-•••••••••••••••",
    stripePublicKey: "pk_test_•••••••••••••••",
    stripeSecretKey: "sk_test_•••••••••••••••",
    currency: "USD",
    taxRate: "8.5"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newCustomerRegistration: true,
    customerReviews: true
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // In a real app, you would save to your API
      // await axios.post("http://localhost:5000/api/settings", {
      //   general: generalSettings,
      //   email: emailSettings,
      //   payment: paymentSettings,
      //   notifications: notificationSettings
      // }, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      // });
      
      // Just simulate a delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Settings</h1>
      </div>

      {saveSuccess && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-300 px-4 py-3 mb-6 rounded-md">
          Settings saved successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/40 border border-red-700/50 text-red-300 px-4 py-3 mb-6 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-neutral-800">
            <nav className="p-4">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === "general" 
                    ? "bg-red-800/20 text-red-500" 
                    : "text-white hover:bg-neutral-800"
                }`}
              >
                General Settings
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === "email" 
                    ? "bg-red-800/20 text-red-500" 
                    : "text-white hover:bg-neutral-800"
                }`}
              >
                Email Settings
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === "payment" 
                    ? "bg-red-800/20 text-red-500" 
                    : "text-white hover:bg-neutral-800"
                }`}
              >
                Payment Settings
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === "notifications" 
                    ? "bg-red-800/20 text-red-500" 
                    : "text-white hover:bg-neutral-800"
                }`}
              >
                Notification Settings
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit}>
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">General Settings</h2>
                  
                  <div>
                    <label htmlFor="storeName" className="block text-white font-medium mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      value={generalSettings.storeName}
                      onChange={handleGeneralChange}
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="storeEmail" className="block text-white font-medium mb-2">
                      Store Email
                    </label>
                    <input
                      type="email"
                      id="storeEmail"
                      name="storeEmail"
                      value={generalSettings.storeEmail}
                      onChange={handleGeneralChange}
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="customerServiceEmail" className="block text-white font-medium mb-2">
                      Customer Service Email
                    </label>
                    <input
                      type="email"
                      id="customerServiceEmail"
                      name="customerServiceEmail"
                      value={generalSettings.customerServiceEmail}
                      onChange={handleGeneralChange}
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-white font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={generalSettings.phoneNumber}
                      onChange={handleGeneralChange}
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-white font-medium mb-2">
                      Store Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralChange}
                      rows="3"
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === "email" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Email Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="smtpServer" className="block text-white font-medium mb-2">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        id="smtpServer"
                        name="smtpServer"
                        value={emailSettings.smtpServer}
                        onChange={handleEmailChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="smtpPort" className="block text-white font-medium mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        id="smtpPort"
                        name="smtpPort"
                        value={emailSettings.smtpPort}
                        onChange={handleEmailChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="smtpUsername" className="block text-white font-medium mb-2">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        id="smtpUsername"
                        name="smtpUsername"
                        value={emailSettings.smtpUsername}
                        onChange={handleEmailChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="smtpPassword" className="block text-white font-medium mb-2">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        id="smtpPassword"
                        name="smtpPassword"
                        value={emailSettings.smtpPassword}
                        onChange={handleEmailChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableSsl"
                      name="enableSsl"
                      checked={emailSettings.enableSsl}
                      onChange={handleEmailChange}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                    />
                    <label htmlFor="enableSsl" className="ml-2 block text-white">
                      Enable SSL/TLS
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fromEmail" className="block text-white font-medium mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        id="fromEmail"
                        name="fromEmail"
                        value={emailSettings.fromEmail}
                        onChange={handleEmailChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fromName" className="block text-white font-medium mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        id="fromName"
                        name="fromName"
                        value={emailSettings.fromName}
                        onChange={handleEmailChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Payment Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enablePaypal"
                        name="enablePaypal"
                        checked={paymentSettings.enablePaypal}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="enablePaypal" className="ml-2 block text-white">
                        Enable PayPal
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableStripe"
                        name="enableStripe"
                        checked={paymentSettings.enableStripe}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="enableStripe" className="ml-2 block text-white">
                        Enable Stripe
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableCod"
                        name="enableCod"
                        checked={paymentSettings.enableCod}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="enableCod" className="ml-2 block text-white">
                        Enable Cash on Delivery
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="paypalClientId" className="block text-white font-medium mb-2">
                      PayPal Client ID
                    </label>
                    <input
                      type="text"
                      id="paypalClientId"
                      name="paypalClientId"
                      value={paymentSettings.paypalClientId}
                      onChange={handlePaymentChange}
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="stripePublicKey" className="block text-white font-medium mb-2">
                      Stripe Public Key
                    </label>
                    <input
                      type="text"
                      id="stripePublicKey"
                      name="stripePublicKey"
                      value={paymentSettings.stripePublicKey}
                      onChange={handlePaymentChange}
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="stripeSecretKey" className="block text-white font-medium mb-2">
                      Stripe Secret Key
                    </label>
                    <input
                      type="password"
                      id="stripeSecretKey"
                      name="stripeSecretKey"
                      value={paymentSettings.stripeSecretKey}
                      onChange={handlePaymentChange}
                      className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="currency" className="block text-white font-medium mb-2">
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={paymentSettings.currency}
                        onChange={handlePaymentChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="taxRate" className="block text-white font-medium mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="text"
                        id="taxRate"
                        name="taxRate"
                        value={paymentSettings.taxRate}
                        onChange={handlePaymentChange}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <p className="text-neutral-400">Select which notifications you want to send to customers and admins.</p>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orderConfirmation"
                        name="orderConfirmation"
                        checked={notificationSettings.orderConfirmation}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="orderConfirmation" className="ml-2 block text-white">
                        Order Confirmation
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orderShipped"
                        name="orderShipped"
                        checked={notificationSettings.orderShipped}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="orderShipped" className="ml-2 block text-white">
                        Order Shipped
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orderDelivered"
                        name="orderDelivered"
                        checked={notificationSettings.orderDelivered}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="orderDelivered" className="ml-2 block text-white">
                        Order Delivered
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="lowStockAlert"
                        name="lowStockAlert"
                        checked={notificationSettings.lowStockAlert}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="lowStockAlert" className="ml-2 block text-white">
                        Low Stock Alert (Admin)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newCustomerRegistration"
                        name="newCustomerRegistration"
                        checked={notificationSettings.newCustomerRegistration}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="newCustomerRegistration" className="ml-2 block text-white">
                        New Customer Registration (Admin)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="customerReviews"
                        name="customerReviews"
                        checked={notificationSettings.customerReviews}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-neutral-700 rounded"
                      />
                      <label htmlFor="customerReviews" className="ml-2 block text-white">
                        New Product Reviews (Admin)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 border-t border-neutral-800 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-md flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>Save Settings</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;
