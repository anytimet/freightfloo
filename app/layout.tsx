import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import ToastContainer from '@/components/Toast'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CustomHead from '@/components/CustomHead'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FreightFloo - Freight Marketplace',
  description: 'Connect shippers with carriers for efficient freight transportation',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'robots': 'index, follow',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <CustomHead />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
