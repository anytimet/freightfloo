'use client'

import Navigation from '@/components/Navigation'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using FreightFloo ("the Platform"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="space-y-4 text-gray-700">
                <p>FreightFloo is a freight marketplace platform that connects:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Shippers:</strong> Individuals and businesses looking to transport goods</li>
                  <li><strong>Carriers:</strong> Licensed trucking companies and independent drivers</li>
                </ul>
                <p>The platform facilitates freight matching, bidding, payment processing, and shipment tracking.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Account Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Carrier Verification</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Valid DOT and MC numbers required</li>
                  <li>Insurance and licensing verification</li>
                  <li>Equipment type and capacity information</li>
                  <li>Background checks may be required</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Platform Rules and Conduct</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Prohibited Activities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting false or misleading information</li>
                  <li>Engaging in fraudulent or illegal activities</li>
                  <li>Harassment or abuse of other users</li>
                  <li>Circumventing platform fees or policies</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Attempting to hack or compromise the platform</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Content Standards</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Shipment descriptions must be accurate and complete</li>
                  <li>No prohibited or illegal cargo</li>
                  <li>Respectful communication between users</li>
                  <li>Compliance with transportation regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Bidding and Transactions</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Bidding Process</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Carriers may bid on available shipments</li>
                  <li>Bids are binding commitments</li>
                  <li>Shippers may accept or reject bids</li>
                  <li>Accepted bids create a binding contract</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payments processed through Stripe</li>
                  <li>Platform fees deducted from transactions</li>
                  <li>Payment required before shipment assignment</li>
                  <li>Refund policies apply as specified</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Fees and Payments</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Platform Fees</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Transaction fees apply to completed shipments</li>
                  <li>Fees are clearly disclosed before transactions</li>
                  <li>Payment processing fees may apply</li>
                  <li>Premium features may require subscription fees</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Payment Processing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Secure payment processing through Stripe</li>
                  <li>Automatic fee calculation and deduction</li>
                  <li>Payment holds for dispute resolution</li>
                  <li>Timely disbursement to carriers</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Dispute Resolution</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Dispute Process</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users must attempt to resolve disputes directly</li>
                  <li>Platform mediation available for unresolved disputes</li>
                  <li>Evidence and documentation required</li>
                  <li>Decisions are binding and final</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Refund Policy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds available for valid disputes</li>
                  <li>Processing time: 5-10 business days</li>
                  <li>Administrative fees may apply</li>
                  <li>Fraudulent refund requests are prohibited</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Liability and Disclaimers</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Platform Liability</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>FreightFloo is a marketplace platform only</li>
                  <li>We do not provide transportation services</li>
                  <li>Users are responsible for their own compliance</li>
                  <li>Platform liability is limited as permitted by law</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Service Availability</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform provided "as is" without warranties</li>
                  <li>No guarantee of continuous availability</li>
                  <li>Maintenance and updates may cause downtime</li>
                  <li>Users assume all risks of platform use</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <p>All content, features, and functionality of the platform are owned by FreightFloo and protected by copyright, trademark, and other intellectual property laws.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users may not copy, modify, or distribute platform content</li>
                  <li>User-generated content remains user property</li>
                  <li>Users grant license to use content on the platform</li>
                  <li>Respect for third-party intellectual property rights</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Account Termination</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users may terminate accounts at any time</li>
                  <li>We may suspend or terminate accounts for violations</li>
                  <li>Outstanding obligations must be fulfilled</li>
                  <li>Data retention policies apply after termination</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700">
                These terms are governed by the laws of [Your Jurisdiction]. Any disputes arising from 
                these terms or use of the platform will be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Users will be notified of 
                material changes, and continued use of the platform constitutes acceptance of the 
                updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="space-y-2 text-gray-700">
                <p>For questions about these Terms of Service, please contact us:</p>
                <ul className="list-none space-y-1">
                  <li><strong>Email:</strong> legal@freightfloo.com</li>
                  <li><strong>Address:</strong> FreightFloo, Inc.</li>
                  <li><strong>Phone:</strong> 1-800-FREIGHT</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
