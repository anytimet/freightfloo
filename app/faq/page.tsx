'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How does FreightFloo work?',
    answer: 'FreightFloo connects shippers with verified carriers through our online marketplace. Shippers post their freight needs, carriers bid on shipments, and shippers choose the best offer. We handle the entire process from posting to payment.',
    category: 'General'
  },
  {
    id: '2',
    question: 'Is FreightFloo free to use?',
    answer: 'Yes! Creating an account and posting shipments is completely free for shippers. Carriers can browse and bid on shipments at no cost. We only charge a small commission when a shipment is successfully completed.',
    category: 'General'
  },
  {
    id: '3',
    question: 'How do I verify my carrier credentials?',
    answer: 'We verify carriers through the SAFER database using your DOT or MC number. This ensures all carriers on our platform are legitimate and properly licensed. The verification process is quick and automated.',
    category: 'Carriers'
  },
  {
    id: '4',
    question: 'What types of freight can I ship?',
    answer: 'FreightFloo handles all types of freight including general freight, refrigerated goods, oversized items, hazardous materials, and specialized cargo. Our carriers have equipment for every type of shipment.',
    category: 'Shippers'
  },
  {
    id: '5',
    question: 'How are payments processed?',
    answer: 'Payments are processed securely through our platform. Shippers pay upfront, and funds are held in escrow until the shipment is delivered successfully. Carriers receive payment within 24-48 hours of delivery confirmation.',
    category: 'Payments'
  },
  {
    id: '6',
    question: 'Can I track my shipment in real-time?',
    answer: 'Yes! Our platform provides real-time tracking for all shipments. You can see the current location, estimated delivery time, and receive notifications about any delays or updates.',
    category: 'Tracking'
  },
  {
    id: '7',
    question: 'What if my shipment is damaged or lost?',
    answer: 'All carriers on our platform are required to have proper insurance. In case of damage or loss, we work with the carrier and insurance company to resolve the issue quickly and fairly.',
    category: 'Insurance'
  },
  {
    id: '8',
    question: 'How do I choose the right carrier?',
    answer: 'Our platform shows carrier ratings, reviews, equipment types, and insurance information. You can also see their track record and response time to help you make an informed decision.',
    category: 'Carriers'
  },
  {
    id: '9',
    question: 'Can I cancel a shipment after posting?',
    answer: 'Yes, you can cancel a shipment before a carrier is selected. If a carrier has already been chosen, cancellation policies may apply. Contact our support team for assistance with cancellations.',
    category: 'Shippers'
  },
  {
    id: '10',
    question: 'What equipment types are available?',
    answer: 'Our carriers operate various equipment types including dry vans, flatbeds, refrigerated trailers, containers, tankers, car carriers, and specialized equipment for oversized loads.',
    category: 'Equipment'
  },
  {
    id: '11',
    question: 'How do I get started as a carrier?',
    answer: 'Sign up for a carrier account, verify your DOT/MC number, select your equipment types, and start browsing available shipments. You can begin bidding immediately after verification.',
    category: 'Carriers'
  },
  {
    id: '12',
    question: 'Is there a mobile app?',
    answer: 'Yes! FreightFloo has mobile apps for both iOS and Android. You can browse shipments, place bids, track deliveries, and manage your account on the go.',
    category: 'Mobile'
  }
]

const categories = ['All', 'General', 'Carriers', 'Shippers', 'Payments', 'Tracking', 'Insurance', 'Equipment', 'Mobile']

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory)

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about FreightFloo
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openItems.includes(faq.id) ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary">
                Contact Support
              </a>
              <a href="/help" className="btn-secondary">
                View Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
