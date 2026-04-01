import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Sri Lanka Vehicle Import Tax Calculator',
  description:
    'Calculate Sri Lanka vehicle import taxes including customs duty, excise duty, luxury tax, VAT, and SSCL.',
  keywords: 'Sri Lanka vehicle import tax, customs duty calculator, car import duty',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9fa] antialiased">{children}</body>
    </html>
  )
}
