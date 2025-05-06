import { Link } from "react-router-dom"
import { useState } from "react"
import apiClient from "../api/client"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState({ show: false, isError: false, message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setSubscribeStatus({
        show: true,
        isError: true,
        message: "Please enter a valid email address."
      })
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setSubscribeStatus({
          show: false,
          message: "",
          isError: false,
        })
      }, 3000)
      
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const { data } = await apiClient.post('/subscribers', { email })
      
      setSubscribeStatus({
        show: true,
        isError: false,
        message: data.message || 'Thank you for subscribing to our newsletter!'
      })
      
      setEmail("")
      
      // Hide the success message after 3 seconds (changed from 5 seconds)
      setTimeout(() => {
        setSubscribeStatus({
          show: false,
          message: "",
          isError: false,
        })
      }, 3000)
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus({
        show: true,
        isError: true,
        message: error.response?.data?.message || "Something went wrong. Please try again."
      })
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setSubscribeStatus({
          show: false,
          message: "",
          isError: false,
        })
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <footer className="bg-black border-t border-neutral-800 pt-16 pb-8 relative z-10">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-neutral-900 p-8 md:p-12">
          <div className="max-w-xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Join Our Newsletter</h2>
            <div className="h-0.5 w-16 bg-amber-500 mx-auto mb-5"></div>
            <p className="text-gray-400">Subscribe to our newsletter for exclusive offers and fashion updates</p>
          </div>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-black border border-neutral-800 text-white py-3 px-4 placeholder-neutral-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white uppercase tracking-wider transition-colors flex-shrink-0 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Subscribing</span>
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          
          {subscribeStatus.show && (
            <div className={`mt-4 p-3 text-center ${
              subscribeStatus.isError 
                ? "bg-red-900/30 text-red-200" 
                : "bg-green-900/30 text-green-200"
            }`}>
              {subscribeStatus.message}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="text-xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Fashion Store</span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm">
              Your destination for premium fashion from all designers. High-quality products with worldwide shipping.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center border border-neutral-800 text-neutral-400 hover:text-amber-500 hover:border-amber-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center border border-neutral-800 text-neutral-400 hover:text-amber-500 hover:border-amber-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center border border-neutral-800 text-neutral-400 hover:text-amber-500 hover:border-amber-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center border border-neutral-800 text-neutral-400 hover:text-amber-500 hover:border-amber-500 transition-colors">
                <span className="sr-only">Pinterest</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-white uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=men" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">Men</Link>
              </li>
              <li>
                <Link to="/products?category=women" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">Women</Link>
              </li>
              <li>
                <Link to="/products?category=new" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/products?sale=true" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">Sale</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white uppercase tracking-wider mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white uppercase tracking-wider mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li className="text-sm text-neutral-400">
                <span className="block text-white mb-1">Email:</span>
                support@fashionstore.com
              </li>
              <li className="text-sm text-neutral-400">
                <span className="block text-white mb-1">Phone:</span>
                +1 (555) 123-4567
              </li>
              <li className="text-sm text-neutral-400">
                <span className="block text-white mb-1">Hours:</span>
                Mon-Fri: 9am - 6pm EST
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Fashion Store. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="text-sm text-neutral-500 hover:text-amber-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-neutral-500 hover:text-amber-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
