import { 
  TruckIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

export default function CarrierPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Join Our Carrier Network
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Grow your business with consistent loads, competitive rates, and reliable shippers.
            </p>
            <div className="mt-8">
              <a
                href="/auth/signup?role=carrier"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                Get Started as a Carrier
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose FreightFloo?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of successful carriers who trust our platform
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                <CurrencyDollarIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Higher Earnings</h3>
              <p className="mt-2 text-base text-gray-500">
                Direct access to shippers means better rates and no broker fees. 
                Keep more of what you earn.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                <TruckIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Consistent Loads</h3>
              <p className="mt-2 text-base text-gray-500">
                Access to thousands of shipments daily. Find loads that match 
                your equipment and preferred routes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                <ShieldCheckIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Verified Shippers</h3>
              <p className="mt-2 text-base text-gray-500">
                Work with pre-verified shippers who pay on time. 
                No more chasing payments or dealing with unreliable customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in minutes and start earning more
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white mx-auto text-lg font-bold">
                  1
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Sign Up & Verify</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create your carrier profile and verify your DOT/MC numbers. 
                  We'll validate your credentials with SAFER.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white mx-auto text-lg font-bold">
                  2
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Browse Loads</h3>
                <p className="mt-2 text-base text-gray-500">
                  Search for shipments that match your equipment type, 
                  preferred routes, and schedule.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white mx-auto text-lg font-bold">
                  3
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Submit Bids</h3>
                <p className="mt-2 text-base text-gray-500">
                  Submit competitive bids on loads you want. 
                  Include your rate and any special requirements.
                </p>
              </div>
              
              {/* Step 4 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white mx-auto text-lg font-bold">
                  4
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Get Paid</h3>
                <p className="mt-2 text-base text-gray-500">
                  Complete the shipment and get paid quickly through 
                  our secure payment system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Powerful Tools for Carriers
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Our platform is designed specifically for carriers, with features that help you 
                maximize your efficiency and profitability.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Advanced load filtering and search</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Real-time load notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Route optimization tools</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Performance analytics and reporting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Mobile app for on-the-go management</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Carrier Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-3" />
                    <span className="text-gray-600">Build your reputation with reviews</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Fast payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-gray-600">GPS tracking integration</span>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-purple-500 mr-3" />
                    <span className="text-gray-600">Earnings analytics</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-600">Insurance and liability protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Requirements to Join
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We maintain high standards to ensure quality service for all users
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Requirements</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Valid DOT number</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">MC number (if applicable)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Active insurance coverage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Good safety rating</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Valid CDL (for drivers)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Equipment Types</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Dry Van</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Refrigerated</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Flatbed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Container</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Specialized Equipment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Hear from carriers who've grown their business with FreightFloo
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <blockquote className="text-lg text-gray-600">
                "Since joining FreightFloo, my revenue has increased by 40%. The platform makes it easy 
                to find loads that fit my schedule and equipment."
              </blockquote>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  <div className="ml-4">
                    <div className="text-base font-medium text-gray-900">Mike Johnson</div>
                    <div className="text-base text-gray-500">Owner-Operator, 5 years</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <blockquote className="text-lg text-gray-600">
                "The payment system is fantastic. I get paid within 48 hours of delivery, 
                which helps with cash flow management."
              </blockquote>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  <div className="ml-4">
                    <div className="text-base font-medium text-gray-900">Sarah Williams</div>
                    <div className="text-base text-gray-500">Fleet Owner, 12 trucks</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <blockquote className="text-lg text-gray-600">
                "The customer support is outstanding. They helped me get verified quickly 
                and are always available when I need assistance."
              </blockquote>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  <div className="ml-4">
                    <div className="text-base font-medium text-gray-900">David Rodriguez</div>
                    <div className="text-base text-gray-500">Independent Carrier, 3 years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to grow your business?</span>
            <span className="block text-green-200">Join FreightFloo today and start earning more.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/auth/signup?role=carrier"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                Sign Up Now
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-400"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
