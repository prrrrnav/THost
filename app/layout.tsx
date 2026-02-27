import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700'], variable: '--font-roboto' })

export const metadata: Metadata = {
  title: 'TheHost - PG Management System',
  description: 'Modern PG management platform for owners, admins, and tenants in India.',
}

export const viewport: Viewport = {
  themeColor: '#4361ee',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
     
        {children}
        <Analytics />
      </body>
    </html>
  )
}
