'use client'

import Navigation from '@/components/Navigation'

export default function UserAgreement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Agreement</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement Overview</h2>
              <p className="text-gray-700">
                This User Agreement ("Agreement") governs your use of the FreightFloo platform and services. 
                By creating an account or using our services, you agree to be bound by this Agreement and 
                our Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Account Registration and Verification</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Registration Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain current and up-to-date account information</li>
                  <li>Use a valid email address for account verification</li>
                  <li>Create a strong and secure password</li>
                  <li>Notify us immediately of any changes to your information</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Identity Verification</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email verification required for all accounts</li>
                  <li>Additional verification may be required for high-value transactions</li>
                  <li>Government-issued ID may be requested for carrier accounts</li>
                  <li>Business registration documents required for company accounts</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Responsibilities</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">General Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Use the platform only for lawful business purposes</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Report any suspicious or fraudulent activity</li>
                  <li>Respect the rights and privacy of other users</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Shipper Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate shipment details and requirements</li>
                  <li>Ensure cargo is legal and properly packaged</li>
                  <li>Make timely payments for accepted bids</li>
                  <li>Provide accurate pickup and delivery information</li>
                  <li>Comply with all applicable shipping regulations</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Carrier Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain valid licenses, insurance, and permits</li>
                  <li>Provide accurate equipment and capacity information</li>
                  <li>Fulfill accepted bids according to agreed terms</li>
                  <li>Maintain professional communication with shippers</li>
                  <li>Comply with all transportation safety regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Platform Usage Guidelines</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Acceptable Use</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the platform for legitimate freight transportation needs</li>
                  <li>Provide honest and accurate information in all communications</li>
                  <li>Respect other users and maintain professional conduct</li>
                  <li>Follow platform policies and procedures</li>
                  <li>Report technical issues or bugs promptly</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Prohibited Activities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Creating fake or duplicate accounts</li>
                  <li>Manipulating bidding or rating systems</li>
                  <li>Circumventing platform fees or policies</li>
                  <li>Engaging in harassment or abusive behavior</li>
                  <li>Violating intellectual property rights</li>
                  <li>Attempting to hack or compromise the platform</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Transaction Terms</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Bidding and Acceptance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Bids are binding commitments when accepted</li>
                  <li>Shippers have the right to accept or reject any bid</li>
                  <li>Accepted bids create a binding contract between parties</li>
                  <li>Modifications to accepted bids require mutual agreement</li>
                  <li>Platform fees are non-refundable once transaction is completed</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment must be completed before shipment assignment</li>
                  <li>Platform holds payment until shipment completion</li>
                  <li>Carriers receive payment after successful delivery</li>
                  <li>Disputes may result in payment holds or refunds</li>
                  <li>All fees and charges are clearly disclosed upfront</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Communication and Support</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">User Communication</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use platform messaging system for all communications</li>
                  <li>Maintain professional and respectful communication</li>
                  <li>Respond to messages in a timely manner</li>
                  <li>Keep all communications related to platform transactions</li>
                  <li>Report any inappropriate communication immediately</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Customer Support</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Support available during business hours</li>
                  <li>Emergency support for urgent shipment issues</li>
                  <li>Self-service resources available 24/7</li>
                  <li>Response times vary based on issue priority</li>
                  <li>Support provided in English only</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Dispute Resolution Process</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Dispute Process</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Users must attempt direct resolution first</li>
                  <li>Submit dispute through platform dispute system</li>
                  <li>Provide evidence and documentation</li>
                  <li>Platform mediation and investigation</li>
                  <li>Binding decision and resolution</li>
                </ol>

                <h3 className="text-xl font-medium text-gray-900">Evidence Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Communication records and messages</li>
                  <li>Photos or documentation of issues</li>
                  <li>Third-party verification when applicable</li>
                  <li>Timeline of events and actions taken</li>
                  <li>Any relevant contracts or agreements</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Account Security</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Security Measures</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use strong, unique passwords</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Log out from shared or public computers</li>
                  <li>Report suspicious account activity immediately</li>
                  <li>Keep contact information current</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Account Recovery</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Password reset through email verification</li>
                  <li>Account recovery process for locked accounts</li>
                  <li>Identity verification required for account recovery</li>
                  <li>Support assistance for complex recovery issues</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data and Privacy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy for detailed 
                  information about how we collect, use, and protect your personal information.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We collect only necessary information for platform operation</li>
                  <li>Your data is protected with industry-standard security measures</li>
                  <li>We do not sell your personal information to third parties</li>
                  <li>You have control over your personal information</li>
                  <li>Data retention policies are clearly defined</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Platform Updates and Changes</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Service Updates</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform features may be updated or modified</li>
                  <li>Users will be notified of significant changes</li>
                  <li>Continued use constitutes acceptance of updates</li>
                  <li>New features may require additional agreements</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Policy Changes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Policies may be updated to reflect legal requirements</li>
                  <li>Material changes will be communicated in advance</li>
                  <li>Users may be required to accept updated policies</li>
                  <li>Non-acceptance may result in account restrictions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination and Suspension</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Account Termination</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users may terminate accounts at any time</li>
                  <li>Outstanding obligations must be fulfilled</li>
                  <li>Data retention policies apply after termination</li>
                  <li>Reactivation may be possible under certain conditions</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Account Suspension</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accounts may be suspended for policy violations</li>
                  <li>Investigation period before permanent termination</li>
                  <li>Appeal process available for suspended accounts</li>
                  <li>Reinstatement requires compliance with platform policies</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact and Support</h2>
              <div className="space-y-2 text-gray-700">
                <p>For questions about this User Agreement or platform support:</p>
                <ul className="list-none space-y-1">
                  <li><strong>General Support:</strong> support@freightfloo.com</li>
                  <li><strong>Account Issues:</strong> accounts@freightfloo.com</li>
                  <li><strong>Disputes:</strong> disputes@freightfloo.com</li>
                  <li><strong>Phone:</strong> 1-800-FREIGHT</li>
                  <li><strong>Business Hours:</strong> Monday-Friday, 8 AM - 6 PM EST</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Agreement Acceptance</h2>
              <p className="text-gray-700">
                By using the FreightFloo platform, you acknowledge that you have read, understood, 
                and agree to be bound by this User Agreement. This agreement, together with our 
                Terms of Service and Privacy Policy, constitutes the complete agreement between 
                you and FreightFloo.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
