import { useState, useEffect } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API call to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
      console.error('Contact form submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Touch</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6 animate-scaleIn"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            We're here to help with any questions about our products or services
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info Section */}
        <section className="mb-24 animate-on-scroll" id="contact-info-section">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className={`bg-neutral-900 p-8 text-center border border-neutral-800 transform hover:translate-y-[-5px] transition-all duration-300 rounded-lg shadow-lg ${isVisible['contact-info-section'] ? 'animate-fadeInUp delay-0' : 'opacity-0'}`}>
              <div className="w-16 h-16 mx-auto mb-6 text-amber-500 bg-amber-900/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Email Us</h3>
              <p className="text-gray-400 mb-4">We'll respond as soon as possible</p>
              <a href="mailto:support@starrycomics.com" className="text-amber-500 hover:underline">support@starrycomics.com</a>
            </div>
            
            <div className={`bg-neutral-900 p-8 text-center border border-neutral-800 transform hover:translate-y-[-5px] transition-all duration-300 rounded-lg shadow-lg ${isVisible['contact-info-section'] ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="w-16 h-16 mx-auto mb-6 text-amber-500 bg-amber-900/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Call Us</h3>
              <p className="text-gray-400 mb-4">Mon-Fri from 9am to 6pm</p>
              <a href="tel:+18881234567" className="text-amber-500 hover:underline">+1 (888) 123-4567</a>
            </div>
            
            <div className={`bg-neutral-900 p-8 text-center border border-neutral-800 transform hover:translate-y-[-5px] transition-all duration-300 rounded-lg shadow-lg ${isVisible['contact-info-section'] ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
              <div className="w-16 h-16 mx-auto mb-6 text-amber-500 bg-amber-900/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Visit Us</h3>
              <p className="text-gray-400 mb-4">Come say hello at our store</p>
              <p className="text-amber-500">123 Cosmic Lane, Universe City</p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="animate-on-scroll" id="contact-form-section">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className={`lg:col-span-2 ${isVisible['contact-form-section'] ? 'animate-slideFromLeft' : 'opacity-0'}`}>
              <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider">Let's Connect</h2>
              <div className="h-0.5 w-16 bg-amber-500 mb-6"></div>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                Whether you have a question about our products, need help with an order, or just want to say hello, we'd love to hear from you. Fill out the form and we'll be in touch as soon as possible.
              </p>
              
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-white mb-4">Follow Us</h3>
                <div className="flex space-x-5">
                  <a href="#" className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-amber-700 text-white hover:text-white flex items-center justify-center border border-neutral-700 hover:border-amber-600 transition-all duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-amber-700 text-white hover:text-white flex items-center justify-center border border-neutral-700 hover:border-amber-600 transition-all duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-amber-700 text-white hover:text-white flex items-center justify-center border border-neutral-700 hover:border-amber-600 transition-all duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-amber-700 text-white hover:text-white flex items-center justify-center border border-neutral-700 hover:border-amber-600 transition-all duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v17.056C22 20.896 20.896 22 19.54 22H4.46C3.104 22 2 20.896 2 19.528V2.472C2 1.104 3.104 0 4.46 0h15.08zm-4.632 15.46c.658 0 1.2-.536 1.2-1.2v-4.4a1.2 1.2 0 0 0-2.4 0v4.4c0 .664.542 1.2 1.2 1.2zm-4.632-2a1.2 1.2 0 0 0 1.2-1.2V8.2a1.2 1.2 0 0 0-2.4 0v4.06c0 .664.542 1.2 1.2 1.2zm-4.632 2a1.2 1.2 0 0 0 1.2-1.2v-4.4a1.2 1.2 0 0 0-2.4 0v4.4c0 .664.542 1.2 1.2 1.2z" />
                    </svg>
                  </a>
                </div>

                <div className="mt-10">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80" alt="Customer support team" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
            
            <div className={`lg:col-span-3 ${isVisible['contact-form-section'] ? 'animate-slideFromRight' : 'opacity-0'}`}>
              <div className="bg-neutral-900 p-8 lg:p-10 border border-neutral-800 rounded-lg shadow-lg relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600/5 rounded-full blur-3xl"></div>
                
                <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mx-auto flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">Thank you for reaching out. Our team will review your message and get back to you as soon as possible.</p>
                    <button 
                      onClick={() => setIsSubmitted(false)} 
                      className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 placeholder-gray-500"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 placeholder-gray-500"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 placeholder-gray-500"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 p-3 placeholder-gray-500"
                        placeholder="Tell us what you need assistance with..."
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-4 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] hover:shadow-lg duration-300 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Message...
                          </>
                        ) : (
                          <>Send Message</>
                        )}
                      </button>
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm mt-4">
                        {error}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="mt-24 animate-on-scroll" id="map-section">
          <div className={isVisible['map-section'] ? 'animate-fadeInUp' : 'opacity-0'}>
            <div className="bg-neutral-900 p-6 border border-neutral-800 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Find Our Store</h2>
              <div className="h-0.5 w-16 bg-amber-500 mb-6"></div>
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe 
                  className="w-full h-96 rounded-lg"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26379.99105538886!2d-118.39769688361626!3d34.09878747206136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf20e4c82873%3A0x14015754d926dadb!2sHollywood%2C%20Los%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1635794584643!5m2!1sen!2sus" 
                  width="600" 
                  height="450" 
                  style={{ border: 0 }}
                  allowFullScreen="" 
                  loading="lazy"
                  title="Store Location"
                ></iframe>
              </div>
            </div>
            
            <div className="text-center text-gray-400 text-sm">
              <p>Open Monday through Friday: 9am - 6pm | Saturday: 10am - 4pm | Closed on Sunday</p>
            </div>
          </div>
        </section>
        
        {/* FAQ Link */}
        <section className="mt-24 animate-on-scroll" id="faq-link-section">
          <div className={`relative p-12 rounded-lg overflow-hidden ${isVisible['faq-link-section'] ? 'animate-fadeIn' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #292524, #44403c)' }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Have More Questions?</h2>
                <p className="text-gray-300 mb-0">Check out our frequently asked questions for quick answers to common inquiries.</p>
              </div>
              <div>
                <a href="/faq" className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg">
                  Visit Our FAQ
                </a>
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
        
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
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
        
        .animate-slideFromLeft {
          animation: slideFromLeft 0.8s ease-out forwards;
        }
        
        .animate-slideFromRight {
          animation: slideFromRight 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .delay-0 {
          animation-delay: 0ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .aspect-w-16 {
          position: relative;
          padding-bottom: 56.25%;
        }
        
        .aspect-h-9 {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
