import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sustainable Shipping Practices - FreightFloo Blog',
  description: 'How to reduce your carbon footprint while maintaining efficient shipping operations. Guide to sustainable freight logistics.',
  keywords: 'sustainable shipping, green logistics, carbon footprint, eco-friendly freight, sustainable transportation',
  openGraph: {
    title: 'Sustainable Shipping Practices',
    description: 'How to reduce your carbon footprint while maintaining efficient shipping operations.',
    type: 'article',
    url: 'https://freightfloo.com/blog/sustainable-shipping',
  },
}

export default function SustainableShipping() {
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
              Sustainable Shipping Practices
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>FreightFloo Team</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>November 20, 2024</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>8 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <p className="text-xl text-gray-600 mb-8">
              As environmental concerns grow, businesses are increasingly looking for ways to reduce their carbon footprint while maintaining efficient shipping operations. Here's how you can implement sustainable shipping practices that benefit both the environment and your bottom line.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimize Route Planning</h2>
            <p className="text-gray-700 mb-6">
              Efficient route planning reduces fuel consumption and emissions. Use technology to identify the shortest, most fuel-efficient routes and consolidate shipments to minimize empty miles. Consider factors like traffic patterns, road conditions, and fuel stops.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Eco-Friendly Carriers</h2>
            <p className="text-gray-700 mb-6">
              Partner with carriers that use fuel-efficient vehicles, alternative fuels, or electric trucks. Many carriers now offer carbon-neutral shipping options and provide detailed emissions reporting for your sustainability tracking.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Consolidate Shipments</h2>
            <p className="text-gray-700 mb-6">
              Combine multiple smaller shipments into larger loads to reduce the number of vehicles on the road. This approach maximizes truck capacity utilization and significantly reduces per-unit emissions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use Sustainable Packaging</h2>
            <p className="text-gray-700 mb-6">
              Switch to recyclable, biodegradable, or reusable packaging materials. Optimize package sizes to reduce waste and shipping volume. Consider packaging made from recycled materials or renewable resources.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Implement Just-in-Time Delivery</h2>
            <p className="text-gray-700 mb-6">
              Reduce inventory holding and associated storage emissions by implementing just-in-time delivery systems. This approach minimizes the need for large warehouses and reduces overall transportation requirements.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Leverage Technology</h2>
            <p className="text-gray-700 mb-6">
              Use digital platforms and AI-powered tools to optimize shipping decisions. Technology can help identify the most sustainable shipping options, track emissions, and provide data for continuous improvement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Consider Alternative Transportation Modes</h2>
            <p className="text-gray-700 mb-6">
              Evaluate rail, intermodal, or water transportation for longer distances. These modes often have lower emissions per ton-mile compared to trucking, especially for non-urgent shipments.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Measure and Track Progress</h2>
            <p className="text-gray-700 mb-6">
              Implement systems to measure your carbon footprint and track progress toward sustainability goals. Use this data to identify areas for improvement and demonstrate your environmental commitment to customers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Partner with Like-Minded Companies</h2>
            <p className="text-gray-700 mb-6">
              Collaborate with suppliers, customers, and logistics partners who share your sustainability values. Joint initiatives can create larger environmental impacts and cost savings for all parties involved.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Join the Green Shipping Movement</h3>
              <p className="text-green-800 mb-4">
                FreightFloo helps you find eco-friendly carriers and optimize your shipping for sustainability. Make a positive environmental impact while reducing costs.
              </p>
              <Link href="/auth/signup" className="btn-primary">
                Start Sustainable Shipping
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
