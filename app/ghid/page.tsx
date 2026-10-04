// app/ghid/page.tsx
'use client';

import { useState } from 'react';
import { Search, Building2, Sparkles, AlertCircle, MapPin, Navigation, Home, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { askCivicAssistantAction } from '@/app/actions/guide';

const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
  'Botoșani', 'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
];

export default function GhidCivicPage() {
  const [query, setQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('Argeș'); // Default Argeș
  const [locality, setLocality] = useState('');
  const [loading, setLoading] = useState(false);
  const [cleanResponse, setCleanResponse] = useState<string | null>(null);
  const [mapSearchQuery, setMapSearchQuery] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setCleanResponse(null);
    setMapSearchQuery(null);

    try {
      const res = await askCivicAssistantAction(query, selectedCounty, locality);
      if (res.success && res.answer) {
        const rawText = res.answer;

        // Extragem linia cu căutarea pe hartă
        const mapMatch = rawText.match(/📍 CĂUTARE MAPS: (.*)/);
        if (mapMatch && mapMatch[1]) {
          setMapSearchQuery(mapMatch[1].trim());
        }

        // Eliminăm linia tehnică din textul afișat utilizatorului
        const textWithoutMapLine = rawText.replace(/📍 CĂUTARE MAPS: .*/g, '').trim();
        setCleanResponse(textWithoutMapLine);
      } else {
        setErrorMessage(res.message || 'Nu s-a putut genera un răspuns.');
      }
    } catch (err: unknown) {
      setErrorMessage('A apărut o eroare la conectarea cu serverul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto space-y-5 pb-24">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          Unde Merg? — Ghid Civic
        </h1>
        <p className="text-xs text-zinc-400">
          Ghișee, acte și indicații exacte pentru comune, sate și orașe.
        </p>
      </header>

      {/* Banner / Acces Rapid Generator Cerere PDF */}
      <Link
        href="/ghid/cerere"
        className="p-3.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-between transition group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Generare Cerere A4 PDF</h3>
            <p className="text-[10px] text-zinc-400">Completează și descarcă formulare oficiale.</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition" />
      </Link>

      <form onSubmit={handleSearch} className="space-y-2.5">
        {/* Filtre Locație: Județ + Localitate */}
        <div className="grid grid-cols-2 gap-2">
          {/* Selector Județ */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2">
            <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none w-full cursor-pointer"
            >
              {JUDETE.map((j) => (
                <option key={j} value={j} className="bg-zinc-900 text-white">
                  Jud. {j}
                </option>
              ))}
            </select>
          </div>

          {/* Câmp Oraș / Comună / Sat */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2">
            <Home className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="Oraș / Comună / Sat"
              className="bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Căutare */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Unde-mi fac buletinul sau plătesc amenda?"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pl-10 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {loading ? 'Se caută informațiile...' : 'Caută Ghid & Ghișeu'}
        </button>
      </form>

      {/* Mesaj de Eroare */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Răspuns Curat + Buton Hartă */}
      {cleanResponse && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2 text-zinc-300 leading-relaxed whitespace-pre-line shadow-xl">
            {cleanResponse}
          </div>

          {mapSearchQuery && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-blue-500/5"
            >
              <MapPin className="w-4 h-4 text-blue-400" />
              Deschide Ghișeul pe Hartă ({locality ? `${locality}, ${selectedCounty}` : selectedCounty})
            </a>
          )}
        </div>
      )}
    </div>
  );
}