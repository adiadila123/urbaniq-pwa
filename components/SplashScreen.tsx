// components/SplashScreen.tsx
'use client';

import { useState, useEffect } from 'react';
import { Building2, Sparkles, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const CHECK_STEPS = [
  'Inițializare modul civic...',
  'Conectare securizată Neon DB...',
  'Se încarcă Harta Comunității...',
  'Activare Asistent Civic AI...',
  'Sistem pregătit!'
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progres progresiv al barei de încărcare
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 700); // Durata tranziției de ieșire
          return 100;
        }

        const nextProgress = prev + Math.floor(Math.random() * 15) + 5;

        // Schimbăm mesajul de stare în funcție de procentaj
        const currentStep = Math.min(
          Math.floor((nextProgress / 100) * CHECK_STEPS.length),
          CHECK_STEPS.length - 1
        );
        setStepIndex(currentStep);

        return Math.min(nextProgress, 100);
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 bg-zinc-950 text-white transition-all duration-700 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Glow Mesh Ambient Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-60 h-60 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Spațiere Top */}
      <div className="w-full" />

      {/* Hero / Logo Centrat cu Animație */}
      <div className="flex flex-col items-center text-center space-y-4 z-10">
        <div className="relative">
          {/* Inel exterior animat */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-500 opacity-75 blur-md animate-tilt" />

          <div className="relative p-5 rounded-3xl bg-zinc-900 border border-zinc-800/80 shadow-2xl flex items-center justify-center">
            <Building2 className="w-12 h-12 text-blue-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            URBANIQ
          </h1>
          <p className="text-xs text-blue-400/90 font-medium tracking-wide uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Platformă Civică Inteligentă
          </p>
        </div>
      </div>

      {/* Progres & Loader de Jos */}
      <div className="w-full max-w-xs space-y-4 z-10">
        {/* Status Text & Procentaj */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400 font-medium flex items-center gap-1.5">
            {progress === 100 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            )}
            {CHECK_STEPS[stepIndex]}
          </span>
          <span className="text-white font-bold font-mono">{progress}%</span>
        </div>

        {/* Bara de Progres cu Gradient Glowing */}
        <div className="w-full h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(37,99,235,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[10px] text-center text-zinc-600 font-mono">
          Urbaniq v1.0 • Ghid & Sesizări Civice
        </p>
      </div>
    </div>
  );
}