'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'We are looking for a Senior Full Stack Developer to join our engineering team and help build the future of freight logistics.',
      requirements: [
        '5+ years of experience with React, Node.js, and TypeScript',
        'Experience with Next.js and modern web development',
        'Knowledge of database design and optimization',
        'Experience with cloud platforms (AWS, Google Cloud, or Azure)',
        'Strong problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development budget',
        'Unlimited PTO'
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Join our product team to help shape the future of freight logistics and create amazing user experiences.',
      requirements: [
        '3+ years of product management experience',
        'Experience in logistics or transportation industry preferred',
        'Strong analytical and problem-solving skills',
        'Excellent communication and collaboration skills',
        'Experience with agile development methodologies'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development budget',
        'Unlimited PTO'
      ]
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our customers succeed and grow their business with FreightFloo.',
      requirements: [
        '2+ years of customer success or account management experience',
        'Experience in logistics or transportation industry preferred',
        'Strong communication and relationship-building skills',
        'Analytical mindset with attention to detail',
        'Experience with CRM systems'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development budget',
        'Unlimited PTO'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of freight logistics. Join us in creating innovative solutions 
            that connect shippers with trusted carriers worldwide.
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Work at FreightFloo?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BriefcaseIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Meaningful Work</h3>
              <p className="text-gray-600">
                Help revolutionize the freight industry and make a real impact on global commerce.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Location</h3>
              <p className="text-gray-600">
                Work from anywhere with our remote-first culture and flexible arrangements.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Work-Life Balance</h3>
              <p className="text-gray-600">
                Unlimited PTO, flexible hours, and a culture that values your well-being.
              </p>
            </div>
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Open Positions
          </h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    className="btn-primary flex items-center"
                  >
                    {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                    <ArrowRightIcon className={`h-4 w-4 ml-2 transition-transform ${selectedJob === job.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                {selectedJob === job.id && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h4>
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <a
                        href={`mailto:careers@freightfloo.com?subject=Application for ${job.title}`}
                        className="btn-primary inline-flex items-center"
                      >
                        Apply Now
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-primary-100 mb-6">
            We're always looking for talented individuals to join our team. 
            Send us your resume and let us know how you'd like to contribute.
          </p>
          <a
            href="mailto:careers@freightfloo.com?subject=General Application"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Send Us Your Resume
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  )
}
