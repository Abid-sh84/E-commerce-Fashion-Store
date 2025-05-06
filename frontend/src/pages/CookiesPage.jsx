import { Link } from "react-router-dom";
import PageTemplate from "../components/PageTemplate";

const CookiesPage = () => {
  return (
    <PageTemplate
      title="Cookie Policy"
      subtitle="How we use cookies on our website"
    >
      <div className="space-y-8 text-indigo-200">
        <p className="italic text-sm">Last Updated: May 15, 2023</p>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Introduction</h3>
          <p className="mb-4">
            This Cookie Policy explains how Starry Comics ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          <p>
            Please read this Cookie Policy carefully before using our Website. By using our Website, you consent to our use of cookies in accordance with this policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">What Are Cookies?</h3>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information. They help us remember your actions and preferences over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Types of Cookies We Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-indigo-900/50 p-5 rounded-xl border border-indigo-700/50">
              <h4 className="font-bold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Essential Cookies
              </h4>
              <p className="text-sm">These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.</p>
            </div>
            
            <div className="bg-indigo-900/50 p-5 rounded-xl border border-indigo-700/50">
              <h4 className="font-bold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Analytics Cookies
              </h4>
              <p className="text-sm">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.</p>
            </div>
            
            <div className="bg-indigo-900/50 p-5 rounded-xl border border-indigo-700/50">
              <h4 className="font-bold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Functionality Cookies
              </h4>
              <p className="text-sm">These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</p>
            </div>
            
            <div className="bg-indigo-900/50 p-5 rounded-xl border border-indigo-700/50">
              <h4 className="font-bold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Targeting Cookies
              </h4>
              <p className="text-sm">These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.</p>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Managing Cookies</h3>
          <p className="mb-4">
            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
          </p>
          <p>
            To manage cookies on different browsers, please follow the instructions provided by your browser.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Third-Party Cookies</h3>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements on and through the website, and so on. These are cookies from services like Google Analytics, Google Ads, Facebook Pixel, and others that help us understand how our website is being used and how we can improve it.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <p className="mb-6">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
          </p>
          
          <div className="bg-indigo-900/50 p-5 rounded-xl border border-indigo-700/50 max-w-md mb-8">
            <p className="mb-1"><span className="text-yellow-300 font-medium">Email:</span> privacy@starrycomics.com</p>
            <p className="mb-1"><span className="text-yellow-300 font-medium">Address:</span> 123 Cosmic Lane, Universe City, Galaxy 12345</p>
            <p><span className="text-yellow-300 font-medium">Phone:</span> +1 (888) 123-4567</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-indigo-950 font-bold rounded-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Contact Us
            </Link>
            <Link 
              to="/privacy" 
              className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              View Privacy Policy
            </Link>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default CookiesPage;
