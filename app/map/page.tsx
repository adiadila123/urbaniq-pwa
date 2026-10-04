// app/map/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, ThumbsUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { upvoteReportAction } from '@/app/actions/reports';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">
      Se încarcă harta...
    </div>
  ),
});

interface ReportItem {
  id: string;
  title: string;
  category: string;
  county: string;
  locality: string;
  lat: number;
  lng: number;
  status: 'pending' | 'in_progress' | 'resolved';
  upvotesCount: number;
}

const MOCK_REPORTS: ReportItem[] = [
  { id: '1', title: 'Groapă pe carosabil', category: 'Infrastructură', county: 'Cluj', locality: 'Florești', lat: 46.741, lng: 23.483, status: 'pending', upvotesCount: 14 },
  { id: '2', title: 'Iluminat public stins', category: 'Utilități', county: 'București', locality: 'Sector 1', lat: 44.432, lng: 26.106, status: 'in_progress', upvotesCount: 28 },
  { id: '3', title: 'Gunoaie neridicate', category: 'Salubritate', county: 'Iași', locality: 'Iași', lat: 47.158, lng: 27.601, status: 'resolved', upvotesCount: 42 },
];

export default function CommunityMapPage() {
  const [reportsList, setReportsList] = useState<ReportItem[]>(MOCK_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleVote = async (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation(); // Prevenim declanșarea selecției pe card la vot
    const deviceToken = typeof window !== 'undefined' ? localStorage.getItem('device_token') || Math.random().toString(36).substring(2) : 'guest';
    if (typeof window !== 'undefined') localStorage.setItem('device_token', deviceToken);

    const res = await upvoteReportAction(reportId, deviceToken);
    if (res.success) {
      setReportsList((prev) =>
        prev.map((item) =>
          item.id === reportId ? { ...item, upvotesCount: item.upvotesCount + 1 } : item
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto space-y-5 pb-24">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Harta Comunității
        </h1>
        <p className="text-xs text-zinc-400">Apasă pe o sesizare pentru a o localiza pe hartă.</p>
      </header>

      {/* Componenta Hărții cu Id-ul Selectat */}
      <MapView reports={reportsList} selectedReportId={selectedReportId} />

      {/* Lista de Carduri Interactive */}
      <div className="space-y-3">
        {reportsList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedReportId(item.id)}
            className={`p-4 rounded-2xl bg-zinc-900 border transition cursor-pointer active:scale-[0.99] space-y-3 ${
              selectedReportId === item.id ? 'border-blue-500 bg-blue-950/20' : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-xs font-semibold text-white">{item.title}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  📍 {item.locality}, Jud. {item.county} • {item.category}
                </p>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                item.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                item.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {item.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                {item.status === 'in_progress' && <Clock className="w-3 h-3" />}
                {item.status === 'pending' && <AlertTriangle className="w-3 h-3" />}
                {item.status === 'resolved' ? 'Soluționat' : item.status === 'in_progress' ? 'În lucru' : 'În așteptare'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80">
              <span className="text-[11px] text-zinc-400">
                <b className="text-white">{item.upvotesCount}</b> cetățeni susțin
              </span>
              <button
                onClick={(e) => handleVote(e, item.id)}
                className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Susține +1
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}