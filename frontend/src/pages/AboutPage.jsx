import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AboutPage = () => {
  const [activeYear, setActiveYear] = useState(2015);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    // Initialize intersection observer to trigger animations
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
    
    // Observe all sections
    document.querySelectorAll('.animate-on-scroll').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Enhanced Hero Section with parallax */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1588497859490-85d1c17db96d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 z-10 opacity-30">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Story</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6 animate-scaleIn"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto animate-fadeIn">
            The people and passion behind Starry Comics
          </p>
          
          <div className="mt-10 animate-bounce">
            <a href="#our-story" className="inline-block text-white opacity-75 hover:opacity-100 transition-opacity duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story Section with improved styling */}
        <section className="mb-24 animate-on-scroll" id="story-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider animate-fadeIn">
              Who We Are
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6 animate-scaleIn"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`text-gray-300 space-y-6 ${isVisible['story-section'] ? 'animate-slideFromLeft' : 'opacity-0'}`}>
              <p className="leading-relaxed">
                Starry Comics was founded in 2015 by Sarah Parker, a lifelong comic book enthusiast with a vision to create a haven for fellow fans. What began as a small online shop has grown into a thriving community of collectors, enthusiasts, and casual fans alike.
              </p>
              
              <p className="leading-relaxed">
                Today, our team consists of 15 dedicated comic enthusiasts, designers, and customer support specialists. Together, we curate a comprehensive collection spanning Marvel, DC, Anime, and independent comic universes.
              </p>
              
              <p className="leading-relaxed">
                Whether you're looking for a premium collector's item or everyday superhero apparel, Starry Comics is committed to helping you find the perfect way to celebrate your favorite characters and stories.
              </p>
              
              <div className="pt-4">
                <Link to="/products" className="inline-block px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-medium uppercase tracking-wider border-none transform hover:translate-y-[-5px] transition-all duration-300">
                  Explore Our Collection
                </Link>
              </div>
            </div>
            
            <div className={`relative ${isVisible['story-section'] ? 'animate-slideFromRight' : 'opacity-0'}`}>
              <img 
                src="https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                alt="Comic Book Store" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                <div className="text-center">
                  <div className="text-2xl">8+</div>
                  <div className="text-xs uppercase">Years</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section with animations */}
        <section className="mb-24 animate-on-scroll" id="values-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
              Our Values
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The core principles that drive everything we do at Starry Comics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`bg-neutral-900 p-8 text-center border border-neutral-800 transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-lg ${isVisible['values-section'] ? 'animate-fadeInUp delay-0' : 'opacity-0'}`}>
              <div className="w-16 h-16 mx-auto mb-6 text-amber-500 bg-amber-900/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-4 uppercase tracking-wider">Fan First Approach</h3>
              <p className="text-gray-400 text-sm">
                Created by fans, for fans. We prioritize what collectors and enthusiasts truly want, making sure every product meets the expectations of true fans.
              </p>
            </div>
            
            <div className={`bg-neutral-900 p-8 text-center border border-neutral-800 transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-lg ${isVisible['values-section'] ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="w-16 h-16 mx-auto mb-6 text-amber-500 bg-amber-900/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-4 uppercase tracking-wider">Quality Products</h3>
              <p className="text-gray-400 text-sm">
                Every item we offer meets our strict standards for authenticity and craftsmanship. We work directly with licensed manufacturers to ensure premium quality.
              </p>
            </div>
            
            <div className={`bg-neutral-900 p-8 text-center border border-neutral-800 transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-lg ${isVisible['values-section'] ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
              <div className="w-16 h-16 mx-auto mb-6 text-amber-500 bg-amber-900/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-4 uppercase tracking-wider">Global Community</h3>
              <p className="text-gray-400 text-sm">
                We ship to over 50 countries, connecting superhero fans across the globe. Our international community shares the passion for comic culture.
              </p>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="mb-24 animate-on-scroll" id="timeline-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
              Our Journey
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
          </div>
          
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="flex space-x-4">
              {[2015, 2017, 2019, 2021, 2023].map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeYear === year 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative p-8 bg-neutral-900 border border-neutral-800 rounded-lg">
            {activeYear === 2015 && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-amber-500 mb-4">The Beginning</h3>
                <p className="text-gray-300 mb-4">Sarah Parker founded Starry Comics from her apartment, starting with just 50 products and a passion for comics.</p>
                <div className="mt-4">
                  <img src="https://images.unsplash.com/photo-1612036782180-6f0822045d55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Company founding" className="w-full h-64 object-cover rounded-lg" />
                </div>
              </div>
            )}
            
            {activeYear === 2017 && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-amber-500 mb-4">First Physical Store</h3>
                <p className="text-gray-300 mb-4">We opened our first brick-and-mortar location in downtown Universe City, expanding our team to 5 employees.</p>
                <div className="mt-4">
                  <img src="https://images.unsplash.com/photo-1506729623306-b5a934d88b53?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="First store" className="w-full h-64 object-cover rounded-lg" />
                </div>
              </div>
            )}
            
            {activeYear === 2019 && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-amber-500 mb-4">International Expansion</h3>
                <p className="text-gray-300 mb-4">Starry Comics began shipping to international customers and established partnerships with major comic book publishers.</p>
                <div className="mt-4">
                  <img src="https://images.unsplash.com/photo-1577982787983-e07c6730f2d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80" alt="International expansion" className="w-full h-64 object-cover rounded-lg" />
                </div>
              </div>
            )}
            
            {activeYear === 2021 && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-amber-500 mb-4">Exclusive Product Lines</h3>
                <p className="text-gray-300 mb-4">We launched our first exclusive merchandise collections, collaborating with renowned artists and designers.</p>
                <div className="mt-4">
                  <img src="https://images.unsplash.com/photo-1585057638352-31c134c36297?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Product launch" className="w-full h-64 object-cover rounded-lg" />
                </div>
              </div>
            )}
            
            {activeYear === 2023 && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-amber-500 mb-4">Today</h3>
                <p className="text-gray-300 mb-4">Now with 15 team members, a flagship store, and an online platform reaching fans in 50+ countries, we continue to grow our community and product offerings.</p>
                <div className="mt-4">
                  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Present day" className="w-full h-64 object-cover rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="mb-24 animate-on-scroll" id="stats-section">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`bg-neutral-900 p-8 text-center border-b-4 border-amber-600 ${isVisible['stats-section'] ? 'animate-fadeInUp delay-0' : 'opacity-0'}`}>
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">15+</div>
              <p className="text-gray-400 uppercase tracking-wider text-sm">Team Members</p>
            </div>
            
            <div className={`bg-neutral-900 p-8 text-center border-b-4 border-amber-600 ${isVisible['stats-section'] ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">50+</div>
              <p className="text-gray-400 uppercase tracking-wider text-sm">Countries Served</p>
            </div>
            
            <div className={`bg-neutral-900 p-8 text-center border-b-4 border-amber-600 ${isVisible['stats-section'] ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">5K+</div>
              <p className="text-gray-400 uppercase tracking-wider text-sm">Products</p>
            </div>
            
            <div className={`bg-neutral-900 p-8 text-center border-b-4 border-amber-600 ${isVisible['stats-section'] ? 'animate-fadeInUp delay-600' : 'opacity-0'}`}>
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">100K+</div>
              <p className="text-gray-400 uppercase tracking-wider text-sm">Happy Customers</p>
            </div>
          </div>
        </section>
        
        {/* Enhanced Team Section */}
        <section className="mb-24 animate-on-scroll" id="team-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
              Meet Our Team
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The passionate individuals behind our superhero universe
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`group bg-neutral-900 border border-neutral-800 p-8 text-center transform transition-all duration-500 hover:bg-neutral-800 ${isVisible['team-section'] ? 'animate-fadeInUp delay-0' : 'opacity-0'}`}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500 mx-auto mb-6 transform transition-transform group-hover:scale-110">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=998&q=80" alt="Founder" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Sarah Parker</h3>
              <p className="text-amber-500 text-sm mb-4">Founder & CEO</p>
              <p className="text-gray-400 text-sm mb-6">Comic collector for 15+ years with a passion for bringing superhero stories to life.</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-neutral-400 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className={`group bg-neutral-900 border border-neutral-800 p-8 text-center transform transition-all duration-500 hover:bg-neutral-800 ${isVisible['team-section'] ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500 mx-auto mb-6 transform transition-transform group-hover:scale-110">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80" alt="Creative Director" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Mark Johnson</h3>
              <p className="text-amber-500 text-sm mb-4">Creative Director</p>
              <p className="text-gray-400 text-sm mb-6">Former graphic novelist with a keen eye for merchandise that truly represents beloved characters.</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-neutral-400 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className={`group bg-neutral-900 border border-neutral-800 p-8 text-center transform transition-all duration-500 hover:bg-neutral-800 ${isVisible['team-section'] ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500 mx-auto mb-6 transform transition-transform group-hover:scale-110">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80" alt="CTO" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Aisha Patel</h3>
              <p className="text-amber-500 text-sm mb-4">CTO</p>
              <p className="text-gray-400 text-sm mb-6">Tech expert ensuring our shopping experience is as seamless as possible.</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-neutral-400 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials section */}
        <section className="mb-24 animate-on-scroll" id="testimonials-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
              What Our Fans Say
            </h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`bg-neutral-900 p-6 rounded-lg border border-neutral-800 ${isVisible['testimonials-section'] ? 'animate-fadeInUp delay-0' : 'opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className="text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6 italic">"I've been collecting comics for years, and Starry Comics has the best selection I've found. Their exclusive editions are truly special."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-medium">James Wilson</h4>
                  <p className="text-gray-400 text-xs">Collector since 2018</p>
                </div>
              </div>
            </div>
            
            <div className={`bg-neutral-900 p-6 rounded-lg border border-neutral-800 ${isVisible['testimonials-section'] ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className="text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6 italic">"Customer service is impeccable. When an item arrived damaged, they replaced it immediately without question. Truly heroes of commerce!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Elena Rodriguez</h4>
                  <p className="text-gray-400 text-xs">Comic Enthusiast</p>
                </div>
              </div>
            </div>
            
            <div className={`bg-neutral-900 p-6 rounded-lg border border-neutral-800 ${isVisible['testimonials-section'] ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className="text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6 italic">"The themed collections are amazing! I've decorated my entire office with items from their Hero Workspace collection."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Michael Chang</h4>
                  <p className="text-gray-400 text-xs">Loyal Customer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to action */}
        <section className="animate-on-scroll" id="cta-section">
          <div className="relative p-12 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(to right, #4c1d95, #7e22ce)' }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-3xl font-bold text-white mb-4">Join Our Community of Heroes</h2>
                <p className="text-indigo-200 mb-0">Discover our premium collection of comic merchandise and join thousands of fans worldwide.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg shadow-purple-900/30">
                  Shop Collection
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center">
                  Contact Us
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
        
        .delay-600 {
          animation-delay: 600ms;
        }
        
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(245, 158, 11, 0.5);
          pointer-events: none;
        }
        
        .particle-1 {
          top: 20%;
          left: 20%;
          animation: float 4s ease-in-out infinite;
        }
        
        .particle-2 {
          top: 60%;
          left: 80%;
          animation: float 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .particle-3 {
          top: 80%;
          left: 40%;
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
