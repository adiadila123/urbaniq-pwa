// app/stats/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Building2, Award, Sparkles } from 'lucide-react';
import { getCivicBadges, getUserCivicStats, Badge } from '@/lib/gamification';

export default function StatsPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userStats, setUserStats] = useState({ reportsCount: 0, upvotesCount: 0, petitionsCount: 0 });

  useEffect(() => {
    setBadges(getCivicBadges());
    setUserStats(getUserCivicStats());
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto space-y-5 pb-24">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Statistici & Transparență
        </h1>
        <p className="text-xs text-zinc-400">
          Impactul comunității Urbaniq și activitatea ta civică.
        </p>
      </header>

      {/* Profilul Tău Civic (Gamification) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/30 via-zinc-900 to-zinc-900 border border-blue-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
            <Award className="w-4 h-4 text-blue-400" />
            Nivelul Tău Civic
          </h2>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Insigne
          </span>
        </div>

        {/* Insigne */}
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-2.5 rounded-xl border transition flex items-center gap-2.5 ${
                badge.unlocked
                  ? 'bg-zinc-900/90 border-blue-500/40 text-white'
                  : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600 opacity-60'
              }`}
            >
              <span className="text-xl shrink-0">{badge.icon}</span>
              <div className="overflow-hidden">
                <h3 className="text-[11px] font-bold truncate">{badge.name}</h3>
                <p className="text-[9px] text-zinc-400 line-clamp-1">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rata Națională de Soluționare */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Transparență Municipală Națională
        </h2>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
            <Clock className="w-4 h-4 text-amber-400 mx-auto" />
            <span className="text-lg font-black text-white block">128</span>
            <span className="text-[9px] text-zinc-400 block font-medium">În așteptare</span>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
            <AlertTriangle className="w-4 h-4 text-blue-400 mx-auto" />
            <span className="text-lg font-black text-white block">84</span>
            <span className="text-[9px] text-zinc-400 block font-medium">In lucru</span>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
            <span className="text-lg font-black text-white block">312</span>
            <span className="text-[9px] text-zinc-400 block font-medium">Soluționate</span>
          </div>
        </div>

        {/* Top Orașe Active */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
          <h3 className="text-xs font-semibold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Rată Soluționare pe Administrații
          </h3>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-300 font-medium">Cluj-Napoca</span>
                <span className="text-emerald-400 font-bold">84% soluționate</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-300 font-medium">Botoșani</span>
                <span className="text-blue-400 font-bold">71% soluționate</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '71%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-300 font-medium">București - Sector 1</span>
                <span className="text-amber-400 font-bold">58% soluționate</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}