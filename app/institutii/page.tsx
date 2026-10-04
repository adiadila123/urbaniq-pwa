// app/institutii/page.tsx
'use client';

import { useState } from 'react';
import { Building2, MapPin, Navigation, Home, Search, ExternalLink, Sparkles } from 'lucide-react';

const JUDETE = [
  'Toate Județele', 'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
  'Botoșani', 'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
];

// Baza de date extinsă cu instituții locale și județene
const INSTITUTII_DATABASE = [
  // Cluj
  { id: '1', name: 'SPCLEP - Evidența Persoanelor (Buletine)', county: 'Cluj', locality: 'Cluj-Napoca', searchMap: 'SPCLEP Cluj Napoca Str Motilor' },
  { id: '2', name: 'Primăria Comunei Florești', county: 'Cluj', locality: 'Florești', searchMap: 'Primaria Comunei Floresti Cluj' },
  { id: '3', name: 'Direcția Impozite și Taxe Locale (DITL)', county: 'Cluj', locality: 'Cluj-Napoca', searchMap: 'Directia Impozite si Taxe Locale Cluj Napoca' },

  // București / Ilfov
  { id: '4', name: 'DITL Sector 1', county: 'București', locality: 'Sector 1', searchMap: 'DITL Sector 1 Bucuresti' },
  { id: '5', name: 'SPCLEP Sector 1 (Buletine)', county: 'București', locality: 'Sector 1', searchMap: 'Evidenta Persoanelor Sector 1 Bucuresti' },
  { id: '6', name: 'Primăria Comunei Snagov', county: 'Ilfov', locality: 'Snagov', searchMap: 'Primaria Snagov Ilfov' },

  // Iași
  { id: '7', name: 'Serviciul Pașapoarte Iași', county: 'Iași', locality: 'Iași', searchMap: 'Serviciul Pasapoarte Iasi' },
  { id: '8', name: 'Primăria Municipiului Iași', county: 'Iași', locality: 'Iași', searchMap: 'Primaria Municipiului Iasi' },

  // Botoșani
  { id: '9', name: 'Primăria Comunei Vorona', county: 'Botoșani', locality: 'Vorona', searchMap: 'Primaria Vorona Botosani' },
  { id: '10', name: 'SPCLEP Botoșani (Evidența Persoanelor)', county: 'Botoșani', locality: 'Botoșani', searchMap: 'SPCLEP Botosani' },
];

export default function InstitutiiPage() {
  const [selectedCounty, setSelectedCounty] = useState('Cluj');
  const [localityQuery, setLocalityQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrare triplă: Județ + Localitate + Căutare după nume
  const filteredInstitutions = INSTITUTII_DATABASE.filter((inst) => {
    const matchesCounty = selectedCounty === 'Toate Județele' || inst.county === selectedCounty;
    const matchesLocality = !localityQuery.trim() || inst.locality.toLowerCase().includes(localityQuery.toLowerCase());
    const matchesSearch = !searchQuery.trim() || inst.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCounty && matchesLocality && matchesSearch;
  });

  // Generare căutare dinamică pe Google Maps pentru cazurile când instituția nu e în lista fixă
  const dynamicMapQuery = `${searchQuery || 'Primaria'} ${localityQuery} ${selectedCounty !== 'Toate Județele' ? selectedCounty : ''}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto space-y-5 pb-24">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          Instituții & Ghișee Locale
        </h1>
        <p className="text-xs text-zinc-400">
          Selectează zona ta pentru a găsi adresa și locația pe hartă.
        </p>
      </header>

      {/* Selectori de Locație: Județ + Localitate */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Meniu Județ */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2">
            <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none w-full cursor-pointer"
            >
              {JUDETE.map((j) => (
                <option key={j} value={j} className="bg-zinc-900 text-white">
                  {j === 'Toate Județele' ? j : `Jud. ${j}`}
                </option>
              ))}
            </select>
          </div>

          {/* Câmp Oraș / Comună / Sat */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2">
            <Home className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <input
              type="text"
              value={localityQuery}
              onChange={(e) => setLocalityQuery(e.target.value)}
              placeholder="Oraș / Comună / Sat"
              className="bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Căutare Categorie / Nume Instituție */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ex: Primărie, Pașapoarte, Taxe..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Lista Rezultatelor */}
      <div className="space-y-3">
        {filteredInstitutions.length > 0 ? (
          filteredInstitutions.map((inst) => (
            <div key={inst.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-white">{inst.name}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  📍 {inst.locality}, Jud. {inst.county}
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.searchMap)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Deschide în Hărți
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          ))
        ) : (
          /* Căutare Inteligentă când nu este în lista prestabilită */
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-3">
            <p className="text-xs text-zinc-400">
              Nu am găsit o instituție salvată exact pentru <b className="text-white">{localityQuery || selectedCounty}</b>.
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dynamicMapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-blue-600/20"
            >
              <Sparkles className="w-4 h-4" />
              Caută pe Hartă în {localityQuery ? `${localityQuery}, ${selectedCounty}` : selectedCounty}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}