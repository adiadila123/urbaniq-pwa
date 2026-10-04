// components/CivicBadges.tsx
'use client';

import { useState, useEffect } from 'react';
import { Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCivicBadges, getUserCivicStats, Badge } from '@/lib/gamification';

interface CivicBadgesProps {
  showTitle?: boolean;
  compact?: boolean;
}

export default function CivicBadges({ showTitle = true, compact = false }: CivicBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState({ reportsCount: 0, upvotesCount: 0, petitionsCount: 0 });

  useEffect(() => {
    setBadges(getCivicBadges());
    setStats(getUserCivicStats());
  }, []);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {badges.map((badge) => (
          <div
            key={badge.id}
            title={`${badge.name}: ${badge.description}`}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border shrink-0 transition ${
              badge.unlocked
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-300'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 opacity-50'
            }`}
          >
            <span>{badge.icon}</span>
            <span className="text-[11px]">{badge.name}</span>
            {badge.unlocked ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <Lock className="w-3 h-3 text-zinc-600" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-500/20 space-y-3 shadow-xl">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                Insigne Civice <Sparkles className="w-3 h-3 text-amber-400" />
              </h2>
              <p className="text-[10px] text-zinc-400">Progresul tău în comunitatea Urbaniq</p>
            </div>
          </div>

          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2.5 py-1 rounded-full border border-blue-500/30">
            {unlockedCount} / {badges.length} Deblocate
          </span>
        </div>
      )}

      {/* Grid Insigne */}
      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-2.5 relative overflow-hidden ${
              badge.unlocked
                ? 'bg-zinc-900/90 border-blue-500/40 text-white shadow-md shadow-blue-500/5'
                : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-500 opacity-60'
            }`}
          >
            {/* Iconiță Insignă */}
            <div
              className={`p-2 rounded-xl text-2xl shrink-0 flex items-center justify-center ${
                badge.unlocked ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-900/50'
              }`}
            >
              {badge.icon}
            </div>

            {/* Detalii Insignă */}
            <div className="space-y-0.5 overflow-hidden">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-[11px] font-bold truncate text-zinc-100">{badge.name}</h3>
                {badge.unlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-zinc-600 shrink-0" />
                )}
              </div>
              <p className="text-[9px] text-zinc-400 leading-tight line-clamp-2">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}