// components/ClientShell.tsx
'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import BottomNav from '@/components/BottomNav';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      <main className={loading ? 'hidden' : 'block'}>
        {children}
        <BottomNav />
      </main>
    </>
  );
}