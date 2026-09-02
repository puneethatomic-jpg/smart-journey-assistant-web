import './globals.css';
import React from 'react';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Smart Journey Assistant | AI-Powered Route Planner',
  description: 'Find the best possible route using real-time location, travel modes, route scoring, traffic, and AI explanations.',
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
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
