import './globals.css';
import React from 'react';
import { Metadata, Viewport } from 'next';
import Navbar from '@/components/layout/Navbar';
import AuthGate from '@/components/auth/AuthGate';

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Smart Journey Assistant | AI-Powered Route Planner',
  description: 'Intelligent journey assistant that finds the best route using multi-factor scoring (time, traffic, tolls, distance) and AI explanations.',
  keywords: ['Smart Route', 'AI Route Assistant', 'Journey Planner', 'Route Scoring', 'Maps', 'Navigation'],
  authors: [{ name: 'Smart Journey Team' }],
  openGraph: {
    title: 'Smart Journey Assistant | AI-Powered Route Planner',
    description: 'Find the best possible route using real-time location, travel modes, route scoring, traffic, and AI explanations.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Smart Journey Assistant',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Journey Assistant',
    description: 'AI-Powered Route Optimization & Navigation Engine',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-sky-500 selection:text-slate-950">
        <AuthGate>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthGate>
      </body>
    </html>
  );
}
