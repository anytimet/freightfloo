import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  siteName?: string
  noIndex?: boolean
}

export default function SEOHead({
  title = 'FreightFloo - Freight Shipping Marketplace',
  description = 'Connect shippers with carriers on FreightFloo, the leading freight shipping marketplace. Post shipments, find carriers, and get competitive rates for your freight needs.',
  keywords = 'freight shipping, freight marketplace, shipping quotes, freight carriers, trucking, logistics, freight broker, shipping rates',
  image = '/og-image.jpg',
  url,
  type = 'website',
  siteName = 'FreightFloo',
  noIndex = false
}: SEOHeadProps) {
  const fullTitle = title.includes('FreightFloo') ? title : `${title} | FreightFloo`
  const fullUrl = url ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://freightfloo.com'}${url}` : process.env.NEXT_PUBLIC_BASE_URL || 'https://freightfloo.com'
  const fullImage = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://freightfloo.com'}${image}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="FreightFloo" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="FreightFloo" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FreightFloo",
            "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://freightfloo.com',
            "logo": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://freightfloo.com'}/logo.png`,
            "description": "FreightFloo is a leading freight shipping marketplace connecting shippers with carriers for competitive shipping rates and reliable freight services.",
            "sameAs": [
              "https://twitter.com/freightfloo",
              "https://linkedin.com/company/freightfloo",
              "https://facebook.com/freightfloo"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-800-FREIGHT",
              "contactType": "customer service",
              "availableLanguage": "English"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            }
          })
        }}
      />
    </Head>
  )
}
