import { 
  ClipboardDocumentListIcon, 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon, 
  TruckIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              How FreightFloo Works
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Simple, transparent, and efficient freight shipping in just a few steps.
            </p>
          </div>
        </div>
      </div>

      {/* For Shippers Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              For Shippers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get competitive quotes from verified carriers in minutes
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                  <ClipboardDocumentListIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">1. Post Your Shipment</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create a detailed listing with pickup/delivery locations, cargo details, 
                  and timeline requirements. The more specific you are, the better quotes you'll receive.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                  <MagnifyingGlassIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">2. Compare Quotes</h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive competitive bids from verified carriers. Review carrier profiles, 
                  ratings, and equipment types to make the best choice for your shipment.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                  <CheckCircleIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">3. Track & Pay</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monitor your shipment in real-time and pay securely through our platform. 
                  Leave reviews to help other shippers make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Carriers Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              For Carriers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find loads that match your equipment and routes
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                  <TruckIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">1. Get Verified</h3>
                <p className="mt-2 text-base text-gray-500">
                  Complete your carrier profile with DOT/MC numbers, insurance details, 
                  and equipment types. Our verification process ensures trust and safety.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                  <MagnifyingGlassIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">2. Find Loads</h3>
                <p className="mt-2 text-base text-gray-500">
                  Browse available shipments that match your equipment and preferred routes. 
                  Use filters to find the most profitable opportunities.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                  <CurrencyDollarIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">3. Bid & Win</h3>
                <p className="mt-2 text-base text-gray-500">
                  Submit competitive bids and win loads. Build your reputation through 
                  quality service and grow your business with repeat customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Seamless Communication
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Our built-in messaging system keeps shippers and carriers connected throughout 
                the entire shipping process. No more phone tag or lost emails.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
                  <span className="text-gray-600">Real-time messaging between parties</span>
                </li>
                <li className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
                  <span className="text-gray-600">Automated status updates</span>
                </li>
                <li className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
                  <span className="text-gray-600">Document sharing and storage</span>
                </li>
                <li className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
                  <span className="text-gray-600">Dispute resolution support</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Verified carriers only</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Secure payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Real-time tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Insurance coverage</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No hidden fees, no surprises - just fair pricing for everyone
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Shippers</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Free to post shipments</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">No membership fees</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Pay only when you ship</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Save 15-25% vs traditional brokers</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Carriers</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Free to browse and bid</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Low commission rates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Fast payment processing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Build your reputation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Join thousands of satisfied customers.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/auth/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
