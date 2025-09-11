import Link from 'next/link'
import Image from 'next/image'
import SocialShare from '@/components/SocialShare'
import { 
  TruckIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FreightFloo - Connect Shippers with Trusted Carriers',
  description: 'The leading freight marketplace connecting shippers with verified carriers. Get competitive rates, real-time tracking, and secure payments.',
  keywords: 'freight, shipping, logistics, carriers, shippers, marketplace',
  openGraph: {
    title: 'FreightFloo - Connect Shippers with Trusted Carriers',
    description: 'The leading freight marketplace connecting shippers with verified carriers.',
    type: 'website',
    url: 'https://freightfloo.com',
    images: [
      {
        url: 'https://freightfloo.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'FreightFloo Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreightFloo - Connect Shippers with Trusted Carriers',
    description: 'The leading freight marketplace connecting shippers with verified carriers.',
    images: ['https://freightfloo.com/logo.png'],
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Shippers with
              <span className="block text-primary-200">Trusted Carriers</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              The smartest way to ship freight. Get competitive quotes from verified carriers and track your shipments in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
                Get Started Free
              </Link>
              <Link href="/marketplace" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
                Browse Shipments
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center">
              <SocialShare 
                title="FreightFloo - Digital Freight Marketplace"
                description="Connect shippers with trusted carriers for efficient freight transportation. Simple, transparent, cost-effective shipping solutions."
                className="text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FreightFloo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make freight shipping simple, transparent, and cost-effective for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Carriers</h3>
              <p className="text-gray-600">All carriers are verified and insured for your peace of mind.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your shipments from pickup to delivery with live updates.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">Get multiple quotes and choose the best price for your shipment.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">Safe and secure payment processing with escrow protection.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for all your shipping needs.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Track your shipping performance with detailed analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join the growing community of shippers and carriers who trust FreightFloo.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50,000+</div>
              <div className="text-primary-100">Shipments Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">$2.5M+</div>
              <div className="text-primary-100">Saved by Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">99.8%</div>
              <div className="text-primary-100">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real users who trust FreightFloo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "FreightFloo has revolutionized how we handle our shipping needs. The platform is intuitive, 
                and we've saved thousands of dollars while getting better service."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                  <div className="text-gray-500 text-sm">Logistics Manager, TechCorp</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "As a carrier, FreightFloo has given me access to quality shipments and reliable shippers. 
                The bidding process is fair and transparent."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">MJ</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Johnson</div>
                  <div className="text-gray-500 text-sm">Owner, Johnson Transport</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The real-time tracking feature is amazing. I always know where my shipments are, 
                and the customer service team is incredibly responsive."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">AL</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex Lee</div>
                  <div className="text-gray-500 text-sm">E-commerce Business Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with shipping trends, tips, and industry insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <DocumentTextIcon className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">December 15, 2024</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  10 Tips for Reducing Shipping Costs in 2024
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn proven strategies to minimize your freight shipping expenses while maintaining quality service.
                </p>
                <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  Read more about reducing shipping costs
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <TruckIcon className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">December 10, 2024</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  The Future of Freight Technology
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore how AI, IoT, and automation are transforming the freight and logistics industry.
                </p>
                <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  Read more about freight technology trends
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <ShieldCheckIcon className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">December 5, 2024</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How to Choose the Right Carrier
                </h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive guide to selecting reliable carriers for your shipping needs.
                </p>
                <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  Read more about choosing carriers
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </article>
          </div>

          <div className="text-center mt-12">
            <Link href="/blog" className="btn-primary">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get your freight moving
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Post Your Shipment</h3>
              <p className="text-gray-600">Describe your freight, pickup and delivery locations, and timeline.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Receive Bids</h3>
              <p className="text-gray-600">Get competitive quotes from verified carriers in your area.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose & Ship</h3>
              <p className="text-gray-600">Select the best carrier and track your shipment to delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Shipping?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Join thousands of shippers and carriers who trust FreightFloo for their freight needs. 
              Start saving money and time today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">For Shippers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Get competitive quotes from verified carriers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Save up to 30% on shipping costs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Real-time tracking and updates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Secure payment processing</span>
                </li>
              </ul>
              <Link href="/auth/signup?role=SHIPPER" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors inline-block">
                Start Shipping
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">For Carriers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Access to quality shipments nationwide</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Fair and transparent bidding process</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Guaranteed payments on completion</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span>Build your reputation with reviews</span>
                </li>
              </ul>
              <Link href="/auth/signup?role=CARRIER" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors inline-block">
                Start Carrying
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-primary-100 mb-4">Already have an account?</p>
            <Link href="/auth/signin" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/logo.png"
                    alt="FreightFloo Logo"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      // Fallback to TruckIcon if logo doesn't exist
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'block'
                    }}
                  />
                  <TruckIcon className="h-6 w-6 text-primary-400 hidden" />
                </div>
                <span className="text-lg font-bold">FreightFloo</span>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting shippers with trusted carriers for efficient freight transportation.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com/freightfloo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/freightfloo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/freightfloo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/freightfloo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/business" className="hover:text-white">Business</Link></li>
                <li><Link href="/carrier" className="hover:text-white">Carrier</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/user-agreement" className="hover:text-white">User Agreement</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FreightFloo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
