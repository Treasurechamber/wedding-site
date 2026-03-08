import type { Metadata } from 'next'
import { Great_Vibes, Cormorant_Garamond } from 'next/font/google'
import { AdminProvider } from '@/context/AdminContext'
import { SiteDataProvider } from '@/context/SiteDataContext'
import ConvexClientProvider from './ConvexClientProvider'
import PageTitle from '@/components/PageTitle'
import './globals.css'

const greatVibes = Great_Vibes({
  weight: '400',
  variable: '--font-script',
  subsets: ['latin'],
})

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You're cordially invited to celebrate our wedding.",
  openGraph: { title: "Wedding Invitation", description: "You're cordially invited.", type: 'website' },
  twitter: { card: 'summary_large_image', title: "Wedding Invitation", description: "You're cordially invited." },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${cormorant.variable}`}>
      <body className="antialiased bg-[#0f1729] text-[#FFFEF7]">
        <ConvexClientProvider>
          <AdminProvider>
            <SiteDataProvider>
              <PageTitle />
              {children}
            </SiteDataProvider>
          </AdminProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
