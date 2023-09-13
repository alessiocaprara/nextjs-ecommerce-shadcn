import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthSessionProvider } from './NextAuthSessionProvider'
import Navbar from '@/components/navbar/Navbar'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Capramazon',
  description: 'App generated using shadcn library',
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
          {/* Footbar */}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
