import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Choose the Right Carrier - FreightFloo Blog',
  description: 'A comprehensive guide to selecting reliable carriers for your shipping needs. Expert tips for carrier evaluation and selection.',
  keywords: 'choose carrier, freight carrier selection, reliable shipping, carrier evaluation, logistics guide',
  openGraph: {
    title: 'How to Choose the Right Carrier',
    description: 'A comprehensive guide to selecting reliable carriers for your shipping needs.',
    type: 'article',
    url: 'https://freightfloo.com/blog/choosing-right-carrier',
  },
}

export default function ChoosingRightCarrier() {
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
              How to Choose the Right Carrier
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>FreightFloo Team</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>December 5, 2024</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>6 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <p className="text-xl text-gray-600 mb-8">
              Selecting the right freight carrier is crucial for your business success. The right carrier ensures timely delivery, protects your cargo, and provides excellent customer service. Here's your comprehensive guide to making the best choice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Verify Credentials and Insurance</h2>
            <p className="text-gray-700 mb-6">
              Always check that your carrier has proper licensing, insurance coverage, and safety ratings. Verify their DOT number, MC number, and review their CSA (Compliance, Safety, Accountability) scores. Adequate insurance protects your cargo in case of damage or loss.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Evaluate Service Coverage</h2>
            <p className="text-gray-700 mb-6">
              Ensure the carrier operates in all the geographic areas you need. Check their route coverage, delivery capabilities, and whether they can handle your specific shipping requirements, including special handling needs.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Check Equipment and Capabilities</h2>
            <p className="text-gray-700 mb-6">
              Verify that the carrier has the right equipment for your cargo type. Consider factors like temperature control, security features, weight capacity, and specialized handling equipment for fragile or hazardous materials.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Review Performance History</h2>
            <p className="text-gray-700 mb-6">
              Look into the carrier's track record for on-time delivery, damage rates, and customer satisfaction. Check online reviews, ask for references, and consider their experience with similar shipments to yours.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compare Pricing and Terms</h2>
            <p className="text-gray-700 mb-6">
              While cost is important, don't make it the only factor. Compare pricing structures, payment terms, and any additional fees. Consider the total value proposition, including service quality and reliability.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Assess Communication and Technology</h2>
            <p className="text-gray-700 mb-6">
              Choose carriers that provide real-time tracking, proactive communication, and easy access to shipment information. Modern technology platforms make it easier to manage shipments and resolve issues quickly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Consider Scalability</h2>
            <p className="text-gray-700 mb-6">
              Select a carrier that can grow with your business. Consider their capacity to handle increased volume, seasonal fluctuations, and expanding service requirements as your business grows.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Evaluate Customer Service</h2>
            <p className="text-gray-700 mb-6">
              Responsive customer service is essential for resolving issues quickly. Test their response times, availability, and problem-solving capabilities before committing to a long-term relationship.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Check Financial Stability</h2>
            <p className="text-gray-700 mb-6">
              Ensure the carrier is financially stable and has a good credit rating. This reduces the risk of service disruptions due to financial issues and ensures they can invest in equipment and technology.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Start with a Trial Period</h2>
            <p className="text-gray-700 mb-6">
              Begin with a small shipment or short-term contract to evaluate the carrier's performance. This allows you to assess their service quality before committing to larger volumes or longer-term agreements.
            </p>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Find Verified Carriers on FreightFloo</h3>
              <p className="text-primary-800 mb-4">
                Our platform pre-verifies all carriers, checking credentials, insurance, and performance history. Connect with reliable carriers that meet your specific shipping needs.
              </p>
              <Link href="/browse-shipments" className="btn-primary">
                Browse Verified Carriers
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
