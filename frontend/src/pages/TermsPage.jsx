import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
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
            backgroundImage: `url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Conditions</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6 animate-scaleIn"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Please read these terms carefully before using our services
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 shadow-lg mb-16 animate-on-scroll" id="terms-section">
          <div className={`${isVisible['terms-section'] ? 'animate-fadeIn' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
              Terms and Conditions
            </h2>
            
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">1. Introduction</h3>
              <p className="mb-4 text-gray-300">
                These terms and conditions govern your use of our website and the purchase of products from our online store. By accessing our website and placing an order, you agree to be bound by these terms and conditions.
              </p>
              <p className="text-gray-300">
                These terms constitute a legally binding agreement between you and Starry Comics. If you do not agree to these terms, please do not use our website or services.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">2. Definitions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><span className="text-amber-500 font-medium">"Company," "we," "us,"</span> and <span className="text-amber-500 font-medium">"our"</span> refer to Starry Comics.</li>
                <li><span className="text-amber-500 font-medium">"Website"</span> refers to starrycomics.com and all associated subdomains.</li>
                <li><span className="text-amber-500 font-medium">"Products"</span> refers to any goods listed for sale on our Website.</li>
                <li><span className="text-amber-500 font-medium">"Customer," "you,"</span> and <span className="text-amber-500 font-medium">"your"</span> refer to the individual or entity purchasing Products from us.</li>
                <li><span className="text-amber-500 font-medium">"Order"</span> refers to a request to purchase Products submitted through our Website.</li>
              </ul>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">3. Account Registration</h3>
              <p className="mb-4 text-gray-300">
                To place an order, you may need to register an account on our Website. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              <p className="text-gray-300">
                You agree to provide accurate and current information during the registration process and to update such information to keep it accurate and current. We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate or false.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">4. Product Information and Availability</h3>
              <p className="mb-4 text-gray-300">
                We make every effort to display the colors and features of our Products as accurately as possible. However, the actual colors you see will depend on your monitor, and we cannot guarantee that your display will accurately portray the actual colors of the Products.
              </p>
              <p className="mb-4 text-gray-300">
                All Products are subject to availability. We reserve the right to discontinue any Product at any time. If a Product is out of stock, we may offer you the option to be notified when the Product becomes available again.
              </p>
              <div className="bg-neutral-800 p-4 mt-4 rounded-lg">
                <p className="text-amber-400 font-medium">Product Pricing</p>
                <p className="text-gray-300 text-sm mb-0">
                  Prices for Products are subject to change without notice. We reserve the right to modify or discontinue any Product without notice. We shall not be liable to you or any third party for any modification, price change, or discontinuance of any Product.
                </p>
              </div>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">5. Orders and Payment</h3>
              <p className="mb-4 text-gray-300">
                By placing an Order, you make an offer to purchase the Products at the prices listed, plus any applicable taxes and shipping charges. We reserve the right to accept or decline your Order for any reason.
              </p>
              <p className="mb-4 text-gray-300">
                Payment must be made at the time of placing your Order. We accept various payment methods as indicated on our Website. By submitting payment information, you represent and warrant that you are authorized to use the payment method and that the information you provide is accurate.
              </p>
              <p className="text-gray-300">
                All payments are processed securely. We do not store your credit card information on our servers.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">6. Shipping and Delivery</h3>
              <p className="mb-4 text-gray-300">
                We ship Products to the address you provide when placing your Order. You are responsible for ensuring that the shipping address is accurate.
              </p>
              <p className="mb-4 text-gray-300">
                Estimated delivery times are provided on our Website but are not guaranteed. Delivery times may vary due to factors beyond our control, such as customs clearance for international shipments, weather conditions, or carrier delays.
              </p>
              <p className="text-gray-300">
                Risk of loss and title for Products pass to you upon delivery of the Products to the carrier.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">7. Returns and Refunds</h3>
              <p className="mb-4 text-gray-300">
                Our return and refund policy is available on our Website. By placing an Order, you agree to the terms of our return and refund policy.
              </p>
              <p className="text-gray-300">
                We reserve the right to modify our return and refund policy at any time. Any changes will be effective immediately upon posting on our Website.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">8. Intellectual Property</h3>
              <p className="mb-4 text-gray-300">
                All content on our Website, including text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of the Company or its content suppliers and is protected by copyright laws.
              </p>
              <p className="text-gray-300">
                You may not reproduce, distribute, display, or create derivative works from any content on our Website without the prior written consent of the Company.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">9. Limitation of Liability</h3>
              <p className="mb-4 text-gray-300">
                To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Your access to or use of or inability to access or use the Website;</li>
                <li>Any conduct or content of any third party on the Website;</li>
                <li>Any content obtained from the Website; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">10. Governing Law</h3>
              <p className="text-gray-300">
                These terms and conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of [Your Jurisdiction].
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">11. Changes to Terms</h3>
              <p className="text-gray-300">
                We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our Website. Your continued use of our Website following the posting of changes constitutes your acceptance of such changes.
              </p>
            </section>
            
            <section className="mb-0 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">12. Contact Information</h3>
              <p className="text-gray-300">
                Questions about the Terms of Service should be sent to us at legal@starrycomics.com.
              </p>
              <p className="text-gray-300">
                Last Updated: March 15, 2023
              </p>
            </section>
          </div>
        </div>

        {/* Contact Section */}
        <section className="mt-24 animate-on-scroll" id="terms-contact-section">
          <div className={`relative p-12 rounded-lg overflow-hidden ${isVisible['terms-contact-section'] ? 'animate-fadeIn' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #292524, #44403c)' }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Have Questions About Our Terms?</h2>
                <p className="text-gray-300 mb-0">If you have any questions or concerns about our terms and conditions, please don't hesitate to contact us.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/contact" 
                  className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center justify-center shadow-lg"
                >
                  Contact Us
                </Link>
                <Link 
                  to="/privacy" 
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg border border-neutral-700 flex items-center justify-center"
                >
                  View Privacy Policy
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

export default TermsPage;
