import { 
  BuildingOfficeIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  CogIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Enterprise Solutions
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Scale your shipping operations with our enterprise-grade freight management platform.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Built for Enterprise
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Advanced features designed for high-volume shippers
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Multi-Location Management</h3>
                  <p className="mt-2 text-gray-600">
                    Manage shipments across multiple warehouses, distribution centers, and retail locations from a single dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Advanced Analytics</h3>
                  <p className="mt-2 text-gray-600">
                    Comprehensive reporting and analytics to optimize your shipping operations and reduce costs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Enterprise Security</h3>
                  <p className="mt-2 text-gray-600">
                    Bank-level security with SSO, role-based access control, and compliance with industry standards.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CogIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">API Integration</h3>
                  <p className="mt-2 text-gray-600">
                    Seamlessly integrate with your existing ERP, WMS, and TMS systems through our robust API.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Why Choose FreightFloo Enterprise?
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Our enterprise solution is designed to handle the complex shipping needs of large organizations 
                while providing the flexibility and scalability you need to grow.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Dedicated account management and support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Custom pricing and volume discounts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">Priority access to premium carriers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">White-label solutions available</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3" />
                  <span className="text-gray-600">24/7 dedicated support</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Enterprise Features</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unlimited Shipments</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Custom Reporting</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">API Access</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">SSO Integration</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dedicated Support</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">SLA Guarantees</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Industries We Serve
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Trusted by leading companies across various industries
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Manufacturing</h3>
              <p className="mt-2 text-sm text-gray-500">
                Raw materials, finished goods, and equipment shipping
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Retail & E-commerce</h3>
              <p className="mt-2 text-sm text-gray-500">
                Inventory distribution and last-mile delivery
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Healthcare</h3>
              <p className="mt-2 text-sm text-gray-500">
                Medical equipment and pharmaceutical shipping
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                <CogIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Technology</h3>
              <p className="mt-2 text-sm text-gray-500">
                Electronics, components, and data center equipment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Success Story
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                How a Fortune 500 company reduced shipping costs by 30%
              </p>
            </div>
            
            <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <blockquote className="text-lg text-gray-600">
                  "FreightFloo's enterprise solution has transformed our shipping operations. 
                  We've reduced costs by 30% while improving delivery times and carrier relationships. 
                  The platform's analytics have given us insights we never had before."
                </blockquote>
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-gray-900">Sarah Chen</div>
                      <div className="text-base text-gray-500">VP of Logistics, TechCorp</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">30%</div>
                    <div className="text-sm text-gray-500">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">50%</div>
                    <div className="text-sm text-gray-500">Faster Booking</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">99.5%</div>
                    <div className="text-sm text-gray-500">On-Time Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-500">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Shipping?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Contact our enterprise team to discuss your specific needs
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1-800-FREIGHT"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Call (800) FREIGHT
              </a>
              <a
                href="mailto:enterprise@freightfloo.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                enterprise@freightfloo.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
