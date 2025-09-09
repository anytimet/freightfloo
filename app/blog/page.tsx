import Link from 'next/link'
import { DocumentTextIcon, ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Reducing Shipping Costs in 2024",
    excerpt: "Learn proven strategies to minimize your freight shipping expenses while maintaining quality service.",
    date: "December 15, 2024",
    category: "Cost Optimization",
    readTime: "5 min read",
    slug: "reducing-shipping-costs"
  },
  {
    id: 2,
    title: "The Future of Freight Technology",
    excerpt: "Explore how AI, IoT, and automation are transforming the freight and logistics industry.",
    date: "December 10, 2024",
    category: "Technology",
    readTime: "7 min read",
    slug: "future-freight-technology"
  },
  {
    id: 3,
    title: "How to Choose the Right Carrier",
    excerpt: "A comprehensive guide to selecting reliable carriers for your shipping needs.",
    date: "December 5, 2024",
    category: "Guide",
    readTime: "6 min read",
    slug: "choosing-right-carrier"
  },
  {
    id: 4,
    title: "Understanding Freight Insurance",
    excerpt: "Everything you need to know about protecting your shipments with proper insurance coverage.",
    date: "November 28, 2024",
    category: "Insurance",
    readTime: "4 min read",
    slug: "freight-insurance-guide"
  },
  {
    id: 5,
    title: "Sustainable Shipping Practices",
    excerpt: "How to reduce your carbon footprint while maintaining efficient shipping operations.",
    date: "November 20, 2024",
    category: "Sustainability",
    readTime: "8 min read",
    slug: "sustainable-shipping"
  },
  {
    id: 6,
    title: "Digital Transformation in Logistics",
    excerpt: "The role of digital tools and platforms in modernizing freight and logistics operations.",
    date: "November 15, 2024",
    category: "Digital",
    readTime: "6 min read",
    slug: "digital-transformation-logistics"
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">FreightFloo Blog</h1>
          <p className="text-xl text-gray-600">Insights, tips, and trends in freight shipping and logistics</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <DocumentTextIcon className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Want to stay updated with our latest posts?</p>
          <Link href="/newsletter" className="btn-primary">
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </div>
  )
}
