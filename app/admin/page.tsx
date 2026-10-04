// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Clock, RefreshCw, Lock } from 'lucide-react';
import { getAllReportsAction, updateReportStatusAction } from '@/app/actions/admin';

interface ReportItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  county: string;
  locality: string;
  status: string;
  imageUrl: string | null;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Verificare PIN de acces
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { // Poți schimba PIN-ul dorit aici
      setIsAuthenticated(true);
      setPinError(false);
      loadReports();
    } else {
      setPinError(true);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    const res = await getAllReportsAction();
    if (res.success && res.reports) {
      setReports(res.reports as ReportItem[]);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    await updateReportStatusAction(id, newStatus);
    setUpdatingId(null);
  };

  // 1. Ecran de securitate (Paznic cu PIN)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-xs space-y-4 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-center shadow-2xl"
        >
          <div className="p-3 bg-blue-600/10 text-blue-500 rounded-full w-fit mx-auto border border-blue-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Panou Administrare</h1>
            <p className="text-xs text-zinc-400">Introdu PIN-ul de acces pentru moderare</p>
          </div>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN Acces (ex: 1234)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-center text-sm text-white focus:border-blue-500 focus:outline-none font-mono tracking-widest"
          />

          {pinError && <p className="text-[11px] text-red-400 font-medium">PIN incorect!</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition active:scale-95 shadow-lg shadow-blue-600/20"
          >
            Autentificare Admin
          </button>
        </form>
      </div>
    );
  }

  // 2. Panoul de Administrare cu date reale din Neon DB
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto space-y-5 pb-24">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-3">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            Panou Moderare
          </h1>
          <p className="text-xs text-zinc-400">Gestionare și actualizare status sesizări.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReports}
            disabled={loading}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition active:scale-95"
            title="Reîmprospătează"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-[10px] text-zinc-500 hover:text-red-400 border border-zinc-800 px-2.5 py-1.5 rounded-xl bg-zinc-900"
          >
            Ieșire
          </button>
        </div>
      </header>

      {loading && reports.length === 0 ? (
        <div className="p-8 text-center text-xs text-zinc-500">Se încarcă sesizările din Neon DB...</div>
      ) : reports.length === 0 ? (
        <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
          Nu există nicio sesizare înregistrată.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-lg">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {r.category}
                  </span>
                  <h3 className="text-xs font-semibold text-white mt-1.5">{r.title}</h3>
                  <p className="text-[10px] text-zinc-400">
                    {r.locality}, Jud. {r.county}
                  </p>
                </div>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${
                    r.status === 'resolved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : r.status === 'in_progress'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {r.status === 'resolved' ? 'Soluționat' : r.status === 'in_progress' ? 'În lucru' : 'În așteptare'}
                </span>
              </div>

              {r.description && (
                <p className="text-[11px] text-zinc-300 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/60">
                  {r.description}
                </p>
              )}

              {r.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-zinc-800">
                  <img src={r.imageUrl} alt={r.title} className="w-full h-32 object-cover" />
                </div>
              )}

              {/* Controale Status */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleUpdateStatus(r.id, 'in_progress')}
                  disabled={updatingId === r.id}
                  className={`flex-1 py-2 text-[11px] rounded-xl border flex items-center justify-center gap-1.5 transition active:scale-95 ${
                    r.status === 'in_progress'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-semibold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  În lucru
                </button>

                <button
                  onClick={() => handleUpdateStatus(r.id, 'resolved')}
                  disabled={updatingId === r.id}
                  className={`flex-1 py-2 text-[11px] rounded-xl border flex items-center justify-center gap-1.5 transition active:scale-95 ${
                    r.status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Soluționat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}