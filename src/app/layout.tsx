import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthSessionProvider } from './NextAuthSessionProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CaprAmazon',
  description: 'Nextjs App generated using shadcn library',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
