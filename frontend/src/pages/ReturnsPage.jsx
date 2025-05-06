import PageTemplate from "../components/PageTemplate";
import { Link } from "react-router-dom";

const ReturnsPage = () => {
  return (
    <PageTemplate
      title="Returns & Exchanges"
      subtitle="Our fair and flexible return policy to ensure your satisfaction"
    >
      <div className="space-y-8 text-indigo-200">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-6">
          Return Policy
        </h2>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Return Period</h3>
          <p>
            We offer a 30-day return policy for most items. If you're not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange, subject to the conditions outlined below.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Return Conditions</h3>
          <div className="space-y-4">
            <p>
              To be eligible for a return, your item must be:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unused and in the same condition that you received it</li>
              <li>In the original packaging with all tags and protective materials intact</li>
              <li>Accompanied by a receipt or proof of purchase</li>
              <li>Not a limited edition or special order item (unless defective)</li>
              <li>Not a personalized or custom-made item (unless defective)</li>
              <li>Not discounted more than 30% at the time of purchase (unless defective)</li>
            </ul>
            
            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 my-6">
              <p className="text-white font-medium">
                <span className="text-yellow-300">⚠️ Important: </span>
                Limited edition collectibles, once opened from their protective packaging, can only be returned if defective.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Refunds</h3>
          <p className="mb-4">
            Once we receive your item and inspect it, we'll notify you that we've received your returned item. We'll also notify you of the approval or rejection of your refund.
          </p>
          <p className="mb-4">
            If your return is approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days, depending on your card issuer's policies.
          </p>
          <p className="mb-4">
            <span className="text-yellow-300 font-medium">Original shipping costs:</span> These are non-refundable unless the return is due to our error (you received an incorrect or defective item).
          </p>
          <p>
            <span className="text-yellow-300 font-medium">Return shipping costs:</span> The customer is responsible for return shipping costs unless the return is due to our error.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Exchanges</h3>
          <p className="mb-4">
            For exchanges, follow the same procedure for returns. Once we receive the original item, we'll ship out the replacement. If the exchange is for a different product, any price difference will be charged or refunded accordingly.
          </p>
          <p>
            For size exchanges on apparel, we offer a complimentary one-time exchange service where we cover the return shipping.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">How to Return an Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-900/50 p-6 rounded-xl border border-indigo-700/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-indigo-950 font-bold text-xl">1</span>
              </div>
              <h4 className="font-bold text-white mb-2">Contact Us</h4>
              <p className="text-sm">Email our support team to receive a Return Authorization (RA) number and return instructions.</p>
            </div>
            
            <div className="bg-indigo-900/50 p-6 rounded-xl border border-indigo-700/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-indigo-950 font-bold text-xl">2</span>
              </div>
              <h4 className="font-bold text-white mb-2">Package Your Return</h4>
              <p className="text-sm">Safely package your item in its original packaging and include your RA number prominently on the outside.</p>
            </div>
            
            <div className="bg-indigo-900/50 p-6 rounded-xl border border-indigo-700/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-indigo-950 font-bold text-xl">3</span>
              </div>
              <h4 className="font-bold text-white mb-2">Ship Your Return</h4>
              <p className="text-sm">Send your return to the address provided with your RA number. We recommend using a trackable shipping service.</p>
            </div>
          </div>
          <p className="text-sm italic">
            *Please do not return any items without first contacting us and obtaining an RA number.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Damaged or Defective Items</h3>
          <p className="mb-4">
            If you receive a damaged or defective product, please contact us immediately with photos of the damage. We'll provide instructions on how to return the item and will cover all shipping costs for returns due to our error.
          </p>
          <p>
            For damaged collectibles, please document the damage before opening the package further, as this helps with shipping insurance claims.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-bold text-white mb-4">Questions?</h3>
          <p className="mb-6">
            If you have any questions about our return policy, please don't hesitate to contact us.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-indigo-950 font-bold rounded-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Contact Support
            </Link>
            <Link 
              to="/faq" 
              className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              View FAQs
            </Link>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default ReturnsPage;
