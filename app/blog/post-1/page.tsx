'use client'

import Navigation from '@/components/Navigation'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'

export default function BlogPost1() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Future of Freight Logistics: How Technology is Transforming the Industry
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              <span>FreightFloo Team</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>January 15, 2024</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-xl text-gray-600 mb-8">
              The freight and logistics industry is undergoing a massive transformation, driven by technology, 
              changing consumer expectations, and the need for more efficient supply chains. At FreightFloo, 
              we're at the forefront of this revolution, connecting shippers with trusted carriers through 
              our innovative marketplace platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Current State of Freight Logistics</h2>
            <p className="text-gray-700 mb-6">
              Traditional freight logistics has long been plagued by inefficiencies, lack of transparency, 
              and fragmented communication between shippers and carriers. Many businesses still rely on 
              phone calls, emails, and manual processes to coordinate shipments, leading to delays, 
              miscommunication, and increased costs.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Technology is Changing the Game</h2>
            <p className="text-gray-700 mb-6">
              Modern technology solutions are addressing these pain points head-on. Digital marketplaces 
              like FreightFloo are creating transparent, efficient platforms where shippers can easily 
              find reliable carriers, compare rates, and track shipments in real-time.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Benefits of Digital Freight Platforms:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Transparency:</strong> Real-time tracking and communication</li>
              <li><strong>Efficiency:</strong> Automated matching and bidding processes</li>
              <li><strong>Cost Savings:</strong> Competitive pricing through market dynamics</li>
              <li><strong>Reliability:</strong> Verified carriers and performance tracking</li>
              <li><strong>Scalability:</strong> Easy access to a network of carriers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">The FreightFloo Advantage</h2>
            <p className="text-gray-700 mb-6">
              At FreightFloo, we've built a comprehensive platform that addresses the unique needs of 
              both shippers and carriers. Our reverse auction system ensures competitive pricing, 
              while our verification process guarantees reliable service providers.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Shippers:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Post shipment requests in minutes</li>
              <li>Receive competitive bids from verified carriers</li>
              <li>Track shipments in real-time</li>
              <li>Access to a network of trusted service providers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Carriers:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Access to a steady stream of shipment opportunities</li>
              <li>Competitive bidding system</li>
              <li>Performance tracking and reputation building</li>
              <li>Streamlined communication with shippers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking Ahead</h2>
            <p className="text-gray-700 mb-6">
              The future of freight logistics is bright, with continued innovation in areas like 
              artificial intelligence, blockchain, and IoT devices. These technologies will further 
              enhance transparency, efficiency, and reliability in the industry.
            </p>

            <p className="text-gray-700 mb-8">
              At FreightFloo, we're committed to staying at the forefront of these innovations, 
              continuously improving our platform to better serve our community of shippers and carriers. 
              Join us in revolutionizing the freight logistics industry.
            </p>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Ready to Experience the Future?</h3>
              <p className="text-primary-700 mb-4">
                Whether you're a shipper looking for reliable carriers or a carrier seeking new opportunities, 
                FreightFloo has you covered.
              </p>
              <div className="flex space-x-4">
                <a href="/auth/signup" className="btn-primary">
                  Get Started as Shipper
                </a>
                <a href="/auth/signup" className="btn-secondary">
                  Join as Carrier
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
