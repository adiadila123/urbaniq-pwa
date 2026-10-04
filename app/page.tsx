// app/page.tsx
import Link from 'next/link';
import { Plus, MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex flex-col justify-between items-center font-sans pb-28">

      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center py-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
            U
          </div>
          <span className="font-semibold tracking-tight text-lg text-white">Urbaniq</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
          PWA • Neon DB
        </span>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-md my-auto space-y-6 text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5" /> Raportare Probleme Urbane
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
          Orașul tău, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            modernizat în timp real.
          </span>
        </h1>

        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
          Raportează gropile, iluminatul defect sau depozitările ilegale de deșeuri. Funcționează offline și salvează locația GPS.
        </p>

        <div className="pt-4">
          <Link
            href="/new"
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold rounded-2xl transition duration-200 shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            Adaugă Sesizare Nouă
          </Link>
        </div>
      </section>

      {/* Footer Features & Admin Access Link */}
      <footer className="w-full max-w-md space-y-4 pt-6 border-t border-zinc-800/80">
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-medium text-zinc-200">GPS Automat</p>
            <p className="text-[10px] text-zinc-500">Localizare precisă pe teren</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-1">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <p className="text-xs font-medium text-zinc-200">Offline Sync</p>
            <p className="text-[10px] text-zinc-500">Salvare locală în IndexedDB</p>
          </div>
        </div>

        {/* Link discret de acces Admin */}
        <div className="text-center pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-blue-400 transition-colors py-1 px-3 rounded-lg hover:bg-zinc-900/60 font-mono"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acces Moderare Admin</span>
          </Link>
        </div>
      </footer>

    </main>
  );
}