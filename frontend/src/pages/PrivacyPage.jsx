import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
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
            backgroundImage: `url("https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Policy</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6 animate-scaleIn"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            How we collect, use, and protect your personal information
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 shadow-lg mb-16 animate-on-scroll" id="privacy-section">
          <div className={`${isVisible['privacy-section'] ? 'animate-fadeIn' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
              Privacy Policy
            </h2>
            
            <section className="mb-8">
              <p className="mb-4 text-gray-300">
                At Starry Comics, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
              </p>
              <p className="text-gray-300">
                Please read this Privacy Policy carefully. By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy. If you do not agree, please discontinue use of our website immediately.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">1. Information We Collect</h3>
              <p className="mb-4 text-gray-300">
                We may collect personal information that you provide directly to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Register for an account</li>
                <li>Place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact our customer service</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="mt-4 mb-4 text-gray-300">
                The types of information we may collect include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><span className="text-amber-500 font-medium">Contact Information:</span> Name, email address, mailing address, phone number</li>
                <li><span className="text-amber-500 font-medium">Payment Information:</span> Credit card details, billing address</li>
                <li><span className="text-amber-500 font-medium">Account Information:</span> Username, password, purchase history, preferences</li>
                <li><span className="text-amber-500 font-medium">Device Information:</span> IP address, browser type, operating system</li>
              </ul>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h3>
              <p className="mb-4 text-gray-300">
                We may use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders, account, or customer service inquiries</li>
                <li>Send you marketing communications (if you've opted in)</li>
                <li>Improve our website, products, and services</li>
                <li>Analyze usage patterns and trends</li>
                <li>Protect against fraud and unauthorized transactions</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">3. Cookies and Tracking Technologies</h3>
              <p className="mb-4 text-gray-300">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier.
              </p>
              <p className="mb-4 text-gray-300">
                These technologies help us to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Remember your preferences</li>
                <li>Understand how you use our website</li>
                <li>Personalize your experience</li>
                <li>Improve our website functionality</li>
              </ul>
              <p className="mt-4 text-gray-300">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">4. Third-Party Disclosure</h3>
              <p className="mb-4 text-gray-300">
                We may share your information with third parties in certain circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><span className="text-amber-500 font-medium">Service Providers:</span> We may share your information with third-party vendors, service providers, and other business partners who perform services on our behalf, such as payment processing, shipping, and marketing.</li>
                <li><span className="text-amber-500 font-medium">Business Transfers:</span> If we're involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                <li><span className="text-amber-500 font-medium">Legal Requirements:</span> We may disclose your information if required by law, such as in response to a subpoena, court order, or government request.</li>
              </ul>
              <div className="bg-neutral-800 p-4 mt-4 rounded-lg">
                <p className="text-amber-400 font-medium">Our Commitment</p>
                <p className="text-gray-300 text-sm mb-0">
                  We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as described above.
                </p>
              </div>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">5. Data Security</h3>
              <p className="mb-4 text-gray-300">
                We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your information.
              </p>
              <p className="text-gray-300">
                All transactions are processed through secure encryption, and your payment information is not stored on our servers. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">6. Your Rights</h3>
              <p className="mb-4 text-gray-300">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><span className="text-amber-500 font-medium">Access:</span> You may request copies of your personal information that we hold.</li>
                <li><span className="text-amber-500 font-medium">Correction:</span> You may request that we correct any information you believe is inaccurate.</li>
                <li><span className="text-amber-500 font-medium">Deletion:</span> You may request that we delete your personal information in certain circumstances.</li>
                <li><span className="text-amber-500 font-medium">Restriction:</span> You may request that we restrict the processing of your information in certain circumstances.</li>
                <li><span className="text-amber-500 font-medium">Objection:</span> You may object to our processing of your information in certain circumstances.</li>
                <li><span className="text-amber-500 font-medium">Data Portability:</span> You may request a copy of your information in a machine-readable format.</li>
              </ul>
              <p className="mt-4 text-gray-300">
                To exercise any of these rights, please contact us using the information provided at the end of this Privacy Policy.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">7. Children's Privacy</h3>
              <p className="text-gray-300">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>
            
            <section className="mb-8 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">8. Changes to This Privacy Policy</h3>
              <p className="text-gray-300">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section className="mb-0 border-t border-neutral-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">9. Contact Us</h3>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-neutral-800 p-4 mt-4 rounded-lg">
                <p className="text-white mb-1 font-medium">Starry Comics</p>
                <p className="text-gray-300 mb-1">Email: privacy@starrycomics.com</p>
                <p className="text-gray-300 mb-1">Address: 123 Comic Lane, Superhero City, CA 90210</p>
                <p className="text-gray-300 mb-0">Phone: (555) 123-4567</p>
              </div>
              <p className="text-gray-300 mt-4">
                Last Updated: March 15, 2023
              </p>
            </section>
          </div>
        </div>

        {/* Contact Section */}
        <section className="mt-24 animate-on-scroll" id="privacy-contact-section">
          <div className={`relative p-12 rounded-lg overflow-hidden ${isVisible['privacy-contact-section'] ? 'animate-fadeIn' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #292524, #44403c)' }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Have Questions About Your Privacy?</h2>
                <p className="text-gray-300 mb-0">If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/contact" 
                  className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center justify-center shadow-lg"
                >
                  Contact Us
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

export default PrivacyPage;
