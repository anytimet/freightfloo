import { CheckIcon, UsersIcon, TruckIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

export default function AboutPage() {
  // Force complete rebuild - v2.4 - Fixed carriers API caching issue
  const buildVersion = '2.4'
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              About FreightFloo
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Connecting shippers with reliable carriers to move freight efficiently across the nation.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the freight industry by creating a transparent, efficient marketplace 
              where shippers can find reliable carriers and carriers can grow their business. Our platform 
              eliminates the middleman, reduces costs, and ensures fair pricing for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <CheckIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Transparency</h3>
                <p className="mt-2 text-base text-gray-500">
                  Clear pricing, honest reviews, and open communication between all parties.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Community</h3>
                <p className="mt-2 text-base text-gray-500">
                  Building a trusted network of shippers and carriers working together.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <TruckIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Efficiency</h3>
                <p className="mt-2 text-base text-gray-500">
                  Streamlined processes that save time and money for everyone involved.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <GlobeAltIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Innovation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Leveraging technology to modernize the freight industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                FreightFloo was born from a simple observation: the freight industry was stuck in the past. 
                Shippers were paying too much, carriers were struggling to find consistent work, and the 
                entire process was bogged down by outdated systems and unnecessary intermediaries.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We set out to change that by creating a modern, digital marketplace that connects shippers 
                directly with verified carriers. Today, we're proud to facilitate thousands of shipments 
                across the country, helping businesses grow and carriers thrive.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">By the Numbers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Carriers</span>
                    <span className="font-semibold text-blue-600">2,500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipments Completed</span>
                    <span className="font-semibold text-blue-600">50,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registered Shippers</span>
                    <span className="font-semibold text-blue-600">5,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Savings</span>
                    <span className="font-semibold text-blue-600">15-25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Leadership Team
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Meet the people behind FreightFloo
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto"></div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">John Smith</h3>
              <p className="text-blue-600">CEO & Founder</p>
              <p className="mt-2 text-sm text-gray-500">
                15+ years in logistics and technology
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto"></div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Sarah Johnson</h3>
              <p className="text-blue-600">CTO</p>
              <p className="mt-2 text-sm text-gray-500">
                Former Amazon logistics engineer
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto"></div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Mike Rodriguez</h3>
              <p className="text-blue-600">Head of Operations</p>
              <p className="mt-2 text-sm text-gray-500">
                20+ years in freight operations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Join the FreightFloo community today.</span>
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
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

