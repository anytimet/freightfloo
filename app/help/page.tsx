import Link from 'next/link'
import { 
  BookOpenIcon, 
  PlayIcon, 
  DocumentTextIcon, 
  QuestionMarkCircleIcon,
  TruckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

const helpSections = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using FreightFloo',
    icon: BookOpenIcon,
    articles: [
      { title: 'How to Create an Account', href: '/auth/signup' },
      { title: 'Setting Up Your Profile', href: '/auth/signup' },
      { title: 'Understanding the Dashboard', href: '/dashboard' },
      { title: 'First Steps for Shippers', href: '/how-it-works' },
      { title: 'First Steps for Carriers', href: '/carrier' }
    ]
  },
  {
    title: 'For Shippers',
    description: 'Everything you need to know about shipping freight',
    icon: TruckIcon,
    articles: [
      { title: 'How to Post a Shipment', href: '/how-it-works' },
      { title: 'Understanding Bids', href: '/how-it-works' },
      { title: 'Choosing the Right Carrier', href: '/how-it-works' },
      { title: 'Tracking Your Shipment', href: '/how-it-works' },
      { title: 'Payment and Billing', href: '/how-it-works' }
    ]
  },
  {
    title: 'For Carriers',
    description: 'Guide to finding and winning freight',
    icon: UserGroupIcon,
    articles: [
      { title: 'Carrier Verification Process', href: '/carrier' },
      { title: 'Finding Shipments', href: '/marketplace' },
      { title: 'Placing Competitive Bids', href: '/how-it-works' },
      { title: 'Managing Your Bids', href: '/dashboard' },
      { title: 'Getting Paid', href: '/how-it-works' }
    ]
  },
  {
    title: 'Safety & Security',
    description: 'How we keep your freight and data safe',
    icon: ShieldCheckIcon,
    articles: [
      { title: 'Carrier Verification', href: '/carrier' },
      { title: 'Insurance Coverage', href: '/about' },
      { title: 'Data Security', href: '/about' },
      { title: 'Fraud Prevention', href: '/about' },
      { title: 'Reporting Issues', href: '/contact' }
    ]
  },
  {
    title: 'Payments & Billing',
    description: 'Understanding our payment system',
    icon: CurrencyDollarIcon,
    articles: [
      { title: 'How Payments Work', href: '/how-it-works' },
      { title: 'Escrow Protection', href: '/how-it-works' },
      { title: 'Payment Methods', href: '/how-it-works' },
      { title: 'Billing Questions', href: '/faq' },
      { title: 'Refund Policy', href: '/faq' }
    ]
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: QuestionMarkCircleIcon,
    articles: [
      { title: 'Login Problems', href: '/faq' },
      { title: 'Account Issues', href: '/faq' },
      { title: 'Technical Problems', href: '/faq' },
      { title: 'Mobile App Issues', href: '/faq' },
      { title: 'Contact Support', href: '/contact' }
    ]
  }
]

const quickLinks = [
  { title: 'Video Tutorials', href: '/how-it-works', icon: PlayIcon },
  { title: 'User Manual', href: '/how-it-works', icon: DocumentTextIcon },
  { title: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon },
  { title: 'Contact Support', href: '/contact', icon: BookOpenIcon }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find guides, tutorials, and answers to help you get the most out of FreightFloo
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
            >
              <link.icon className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">{link.title}</h3>
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Help Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpSections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg mr-4">
                  <section.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {section.articles.map((article) => (
                  <li key={article.href}>
                    <Link
                      href={article.href}
                      className="text-primary-600 hover:text-primary-700 text-sm block py-1 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
              <p className="text-gray-600 mb-4">
                A comprehensive guide to help you get started with FreightFloo, whether you're a shipper or carrier.
              </p>
              <Link href="/how-it-works" className="text-primary-600 hover:text-primary-700 font-medium">
                Read Guide →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Best Practices</h3>
              <p className="text-gray-600 mb-4">
                Learn about safety protocols, insurance requirements, and best practices for secure freight transportation.
              </p>
              <Link href="/about" className="text-primary-600 hover:text-primary-700 font-medium">
                Read Guide →
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need More Help?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Contact Support
              </Link>
              <Link href="/faq" className="btn-secondary">
                Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
