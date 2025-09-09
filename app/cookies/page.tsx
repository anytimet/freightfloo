'use client'

import Navigation from '@/components/Navigation'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                enabling various website functions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>FreightFloo uses cookies for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Improve website performance and functionality</li>
                  <li>Analyze how you use our website</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure website security and prevent fraud</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies are necessary for the website to function properly and cannot be disabled.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Authentication and login status</li>
                    <li>Security and fraud prevention</li>
                    <li>Basic website functionality</li>
                    <li>Payment processing security</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Performance Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies help us understand how visitors interact with our website.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Page views and navigation patterns</li>
                    <li>Time spent on pages</li>
                    <li>Error messages and loading times</li>
                    <li>Website performance metrics</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Functional Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies enable enhanced functionality and personalization.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>User preferences and settings</li>
                    <li>Language and region selection</li>
                    <li>Customized content display</li>
                    <li>Remembered form data</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies help us analyze website usage and improve our services.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Google Analytics tracking</li>
                    <li>User behavior analysis</li>
                    <li>Feature usage statistics</li>
                    <li>Conversion tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may use third-party services that set their own cookies:</p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Stripe (Payment Processing)</h4>
                  <p className="text-sm text-gray-600">
                    Used for secure payment processing and fraud prevention. 
                    <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline ml-1">
                      View Stripe's Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Used to analyze website traffic and user behavior. 
                    <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline ml-1">
                      View Google's Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Resend (Email Services)</h4>
                  <p className="text-sm text-gray-600">
                    Used for sending transactional and notification emails. 
                    <a href="https://resend.com/privacy" className="text-blue-600 hover:underline ml-1">
                      View Resend's Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Duration</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Session Cookies</h3>
                <p>These cookies are temporary and are deleted when you close your browser.</p>
                
                <h3 className="text-xl font-medium text-gray-900">Persistent Cookies</h3>
                <p>These cookies remain on your device for a set period or until you delete them:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Authentication cookies:</strong> 30 days</li>
                  <li><strong>Preference cookies:</strong> 1 year</li>
                  <li><strong>Analytics cookies:</strong> 2 years</li>
                  <li><strong>Security cookies:</strong> 90 days</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-medium text-gray-900">Browser Settings</h3>
                <p>You can control cookies through your browser settings:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete existing cookies</li>
                  <li>Set preferences for specific websites</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900">Browser-Specific Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Chrome</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Privacy and security → Cookies and other site data
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Firefox</h4>
                    <p className="text-sm text-gray-600">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                    <p className="text-sm text-gray-600">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Edge</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Cookies and site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you disable cookies, some features of our website may not work properly:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may need to log in repeatedly</li>
                  <li>Your preferences may not be saved</li>
                  <li>Some features may be unavailable</li>
                  <li>Website performance may be affected</li>
                  <li>Personalized content may not be displayed</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in our 
                practices or for other operational, legal, or regulatory reasons. We will notify 
                you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-2 text-gray-700">
                <p>If you have questions about our use of cookies, please contact us:</p>
                <ul className="list-none space-y-1">
                  <li><strong>Email:</strong> privacy@freightfloo.com</li>
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
