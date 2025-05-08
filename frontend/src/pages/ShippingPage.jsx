import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShippingPage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    // Initialize intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('.animate-on-scroll').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-dvh bg-neutral-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
            Shipping <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Policy</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6 animate-scaleIn"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Everything you need to know about how we deliver your products
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 shadow-lg mb-16 animate-on-scroll" id="shipping-info-section">
          <div className={`${isVisible['shipping-info-section'] ? 'animate-fadeIn' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
              Shipping Information
            </h2>
            
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Processing Times</h3>
              <p className="mb-4 text-gray-300">
                All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
              </p>
              <p className="text-gray-300">
                If an item in your order is out of stock, we will contact you with options including waiting for a restock, choosing an alternative item, or receiving a refund.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">Shipping Methods & Delivery Times</h3>
              <div className="overflow-x-auto">
                <table className="w-full mb-4">
                  <thead>
                    <tr className="bg-neutral-800">
                      <th className="px-4 py-3 text-left text-amber-500">Method</th>
                      <th className="px-4 py-3 text-left text-amber-500">Estimated Delivery</th>
                      <th className="px-4 py-3 text-left text-amber-500">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    <tr className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3 text-white">Standard Shipping</td>
                      <td className="px-4 py-3 text-gray-300">5-7 business days</td>
                      <td className="px-4 py-3 text-gray-300">$5.99 (Free over $50)</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3 text-white">Express Shipping</td>
                      <td className="px-4 py-3 text-gray-300">2-3 business days</td>
                      <td className="px-4 py-3 text-gray-300">$12.99</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3 text-white">Next Day Delivery</td>
                      <td className="px-4 py-3 text-gray-300">1 business day</td>
                      <td className="px-4 py-3 text-gray-300">$24.99</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3 text-white">International Shipping</td>
                      <td className="px-4 py-3 text-gray-300">10-14 business days</td>
                      <td className="px-4 py-3 text-gray-300">Varies by location</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-300">
                <span className="text-amber-500">Note:</span> Delivery times are estimates and not guaranteed. Factors like weather, holidays, and customs clearance (for international shipments) can affect delivery times.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">Tracking Information</h3>
              <p className="text-gray-300">
                You will receive a shipping confirmation email with tracking information when your order ships. You can also find tracking information by logging into your account and viewing your order history.
              </p>
              <div className="bg-neutral-800 p-4 mt-4 rounded-lg">
                <p className="text-amber-400 font-medium">Having trouble tracking your package?</p>
                <p className="text-gray-300 text-sm mb-0">
                  Please allow 24 hours after receiving your shipping confirmation for tracking information to update. If you still have issues, please contact our customer service team.
                </p>
              </div>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">International Shipping</h3>
              <p className="mb-4 text-gray-300">
                We ship to most countries worldwide. International customers may be responsible for import duties and taxes when the package reaches your country. These fees are not included in the shipping cost and are the responsibility of the customer.
              </p>
              <p className="text-gray-300">
                Please note that international delivery times can vary significantly depending on customs clearance procedures in your country.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">Shipping Restrictions</h3>
              <p className="mb-4 text-gray-300">
                Some products may have shipping restrictions to certain countries due to licensing agreements or local regulations. If a product cannot be shipped to your location, this will be noted on the product page.
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-4 bg-neutral-800 p-4 rounded-lg mt-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-900/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm mb-0">
                  If you're unsure whether we can ship to your location, please contact our customer service team before placing your order.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Additional Shipping FAQs */}
        <section className="mb-16 animate-on-scroll" id="shipping-faqs-section">
          <div className={`${isVisible['shipping-faqs-section'] ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider text-center">
              Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Shipping Questions</span>
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">What happens if my package is lost?</h3>
                <p className="text-gray-300">
                  If your tracking information hasn't updated for more than 7 days or indicates a delivery issue, please contact our customer service team. We'll file a claim with the carrier and either send a replacement or issue a refund.
                </p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Can I change my shipping address after ordering?</h3>
                <p className="text-gray-300">
                  If your order hasn't shipped yet, we may be able to change the shipping address. Please contact our customer service team immediately with your order number to request an address change.
                </p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Do you offer expedited shipping for all products?</h3>
                <p className="text-gray-300">
                  Expedited shipping is available for most in-stock items. However, pre-order, custom-made, or oversized items may only be eligible for standard shipping. Shipping options will be displayed at checkout.
                </p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Do you ship to PO boxes?</h3>
                <p className="text-gray-300">
                  Yes, we ship to PO boxes using USPS, but expedited shipping and tracking options may be limited. For large or valuable items, we recommend providing a physical address to ensure secure delivery.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="mt-24 animate-on-scroll" id="shipping-contact-section">
          <div className={`relative p-12 rounded-lg overflow-hidden ${isVisible['shipping-contact-section'] ? 'animate-fadeIn' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #292524, #44403c)' }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Have Questions About Your Shipment?</h2>
                <p className="text-gray-300 mb-0">Our customer service team is ready to help with any questions about shipping, tracking, or delivery of your order.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/contact" 
                  className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center justify-center shadow-lg"
                >
                  Contact Support
                </Link>
                <Link 
                  to="/faq" 
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg border border-neutral-700 flex items-center justify-center"
                >
                  View FAQs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShippingPage;
