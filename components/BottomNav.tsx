// components/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, FileText, PlusCircle, Building2, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Acasă', icon: Home },
  { href: '/map', label: 'Hartă', icon: Map },
  { href: '/new', label: 'Raportează', icon: PlusCircle, isMain: true },
  { href: '/ghid', label: 'Ghid AI', icon: FileText },
  { href: '/stats', label: 'Statistici', icon: BarChart3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800/80 px-2 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isMain) {
            return (
              <Link key={item.href} href={item.href} className="relative -top-3">
                <div className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/40 transition active:scale-95 border-2 border-zinc-950">
                  <Icon className="w-5 h-5" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium transition ${
                isActive ? 'text-blue-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}