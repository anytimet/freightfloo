import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Understanding Freight Insurance - FreightFloo Blog',
  description: 'Everything you need to know about protecting your shipments with proper insurance coverage. Complete guide to freight insurance.',
  keywords: 'freight insurance, cargo insurance, shipment protection, logistics insurance, shipping coverage',
  openGraph: {
    title: 'Understanding Freight Insurance',
    description: 'Everything you need to know about protecting your shipments with proper insurance coverage.',
    type: 'article',
    url: 'https://freightfloo.com/blog/freight-insurance-guide',
  },
}

export default function FreightInsuranceGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Understanding Freight Insurance
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>FreightFloo Team</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>November 28, 2024</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>4 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <p className="text-xl text-gray-600 mb-8">
              Freight insurance is essential protection for your shipments against loss, damage, or theft during transit. Understanding the different types of coverage and how to choose the right policy can save you significant costs and stress.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Freight Insurance</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Carrier's Liability</h3>
            <p className="text-gray-700 mb-4">
              This is the basic coverage provided by carriers, but it's often limited and may not cover the full value of your cargo. Coverage typically ranges from $0.50 to $2.00 per pound of cargo weight.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">All-Risk Cargo Insurance</h3>
            <p className="text-gray-700 mb-4">
              Comprehensive coverage that protects against most perils, including theft, damage, and loss. This is the most complete form of cargo insurance available.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Named Perils Coverage</h3>
            <p className="text-gray-700 mb-6">
              Covers specific risks listed in the policy, such as fire, collision, or natural disasters. More limited than all-risk coverage but often more affordable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Considerations</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Coverage Limits</h3>
            <p className="text-gray-700 mb-4">
              Ensure your policy covers the full value of your cargo. Under-insuring can leave you with significant out-of-pocket expenses in case of a claim.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Deductibles</h3>
            <p className="text-gray-700 mb-4">
              Higher deductibles typically result in lower premiums, but you'll pay more out-of-pocket when filing a claim. Choose a deductible that balances cost and risk.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Exclusions</h3>
            <p className="text-gray-700 mb-6">
              Review policy exclusions carefully. Common exclusions include damage from improper packaging, inherent vice, or acts of war.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Proper Documentation</h3>
            <p className="text-gray-700 mb-4">
              Maintain detailed records of your cargo, including photos, invoices, and packing lists. This documentation is crucial for successful claims processing.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Regular Policy Reviews</h3>
            <p className="text-gray-700 mb-4">
              Review your insurance coverage regularly to ensure it matches your current shipping needs and cargo values.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Work with Reputable Providers</h3>
            <p className="text-gray-700 mb-6">
              Choose insurance providers with strong financial ratings and a history of fair claims processing.
            </p>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Protect Your Shipments</h3>
              <p className="text-primary-800 mb-4">
                FreightFloo partners with trusted insurance providers to offer comprehensive coverage options for all your shipping needs. Get quotes and coverage in minutes.
              </p>
              <Link href="/contact" className="btn-primary">
                Get Insurance Quote
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
