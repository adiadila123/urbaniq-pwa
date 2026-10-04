// app/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import BottomNav from '@/components/BottomNav';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="ro" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased font-sans min-h-screen">
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}

        <main className={`${loading ? 'hidden' : 'block'}`}>
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}