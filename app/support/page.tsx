import Link from 'next/link'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: ChatBubbleLeftRightIcon,
    availability: '24/7 Available',
    responseTime: 'Instant',
    href: '#',
    recommended: true
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with a support specialist',
    icon: PhoneIcon,
    availability: 'Mon-Fri 8AM-6PM EST',
    responseTime: 'Immediate',
    href: 'tel:+15551234567'
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: EnvelopeIcon,
    availability: '24/7 Available',
    responseTime: 'Within 24 hours',
    href: '/contact'
  }
]

const supportCategories = [
  {
    title: 'Account Issues',
    description: 'Login, password, profile, and account settings',
    icon: '👤',
    issues: ['Can\'t log in', 'Password reset', 'Profile updates', 'Account verification']
  },
  {
    title: 'Shipping Problems',
    description: 'Issues with posting, tracking, or managing shipments',
    icon: '🚛',
    issues: ['Posting shipments', 'Finding carriers', 'Tracking issues', 'Delivery problems']
  },
  {
    title: 'Payment Issues',
    description: 'Billing, payments, refunds, and financial concerns',
    icon: '💳',
    issues: ['Payment processing', 'Billing questions', 'Refund requests', 'Escrow issues']
  },
  {
    title: 'Technical Problems',
    description: 'App issues, website problems, and technical support',
    icon: '🔧',
    issues: ['App not working', 'Website errors', 'Mobile issues', 'Browser problems']
  }
]

const emergencyContacts = [
  {
    title: 'Emergency Hotline',
    description: 'For urgent shipping emergencies',
    phone: '+1 (555) 911-FREIGHT',
    available: '24/7',
    icon: ExclamationTriangleIcon
  },
  {
    title: 'Safety Issues',
    description: 'Report safety concerns or incidents',
    phone: '+1 (555) SAFETY-1',
    available: '24/7',
    icon: CheckCircleIcon
  }
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get help when you need it. Our support team is here to assist you 24/7.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {supportOptions.map((option) => (
            <div key={option.title} className="relative">
              {option.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {option.availability}
                    </div>
                    <div className="text-sm text-gray-500">
                      Response: {option.responseTime}
                    </div>
                  </div>
                  
                  <Link
                    href={option.href}
                    className={`w-full block py-2 px-4 rounded-lg font-medium transition-colors ${
                      option.recommended
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {option.title === 'Live Chat' ? 'Start Chat' : 
                     option.title === 'Phone Support' ? 'Call Now' : 'Send Email'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What can we help you with?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
                
                <ul className="space-y-1">
                  {category.issues.map((issue) => (
                    <li key={issue} className="text-sm text-gray-600">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Emergency Contacts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact) => (
              <div key={contact.title} className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <contact.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">{contact.title}</h3>
                    <p className="text-red-700 mb-3">{contact.description}</p>
                    <div className="space-y-1">
                      <div className="text-red-800 font-medium">{contact.phone}</div>
                      <div className="text-red-600 text-sm">Available: {contact.available}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="/help" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
              <p className="text-gray-600 text-sm">Browse guides and tutorials</p>
            </div>
          </Link>

          <Link href="/faq" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
              <p className="text-gray-600 text-sm">Find answers to common questions</p>
            </div>
          </Link>

          <Link href="/contact" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600 text-sm">Send us a message</p>
            </div>
          </Link>
        </div>

        {/* Support Hours */}
        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Support Hours</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
              <p className="text-gray-600">24/7 Available</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
              <p className="text-gray-600">Mon-Fri 8AM-6PM EST</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
              <p className="text-gray-600">24/7 Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
