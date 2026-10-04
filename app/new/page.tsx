// app/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { PlusCircle, Navigation, Home, Camera, CheckCircle2, AlertCircle, X, Mail } from 'lucide-react';
import { createReportAction } from '@/app/actions/reports';

const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
  'Botoșani', 'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
];

const CATEGORII = [
  'Infrastructură / Gropi',
  'Iluminat Public',
  'Salubritate / Gunoaie',
  'Parcuri / Spații Verzi',
  'Vehicule Abandonate',
  'Altele',
];

export default function NewReportPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORII[0]);
  const [county, setCounty] = useState('Argeș'); // Default Argeș
  const [locality, setLocality] = useState('');

  // Stare pentru fotografia capturată
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Stare pentru datele instituției returnate după salvare
  const [submittedInstitution, setSubmittedInstitution] = useState<{
    email: string;
    name: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Procesare foto din cameră sau galerie
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locality.trim()) {
      setErrorMessage('Te rugăm să completezi titlul și localitatea.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await createReportAction({
        title,
        description,
        category,
        county,
        locality,
        imageUrl: photoPreview || undefined,
      });

      if (res.success) {
        setSuccess(true);
        if (res.institutionEmail && res.institutionName) {
          setSubmittedInstitution({
            email: res.institutionEmail,
            name: res.institutionName,
          });
        }
        setTitle('');
        setDescription('');
        setLocality('');
        setPhotoPreview(null);
      } else {
        setErrorMessage(res.message || 'A apărut o eroare la salvare.');
      }
    } catch (err) {
      setErrorMessage('Eroare de conexiune cu serverul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto space-y-5 pb-24">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-500" />
          Raportează o Problemă
        </h1>
        <p className="text-xs text-zinc-400">
          Trimite o sesizare către administrația locală din zona ta.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3.5 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-xl">
        {/* Titlu Sesizare */}
        <div>
          <label className="text-[11px] font-medium text-zinc-400 block mb-1">Titlu Sesizare</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Groapă adâncă pe carosabil"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Categorie */}
        <div>
          <label className="text-[11px] font-medium text-zinc-400 block mb-1">Categorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            {CATEGORII.map((cat) => (
              <option key={cat} value={cat} className="bg-zinc-900 text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Locație: Județ + Localitate */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-400 block">Locație (Județ & Localitate)</label>
          <div className="grid grid-cols-2 gap-2">
            {/* Județ */}
            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2">
              <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none w-full cursor-pointer"
              >
                {JUDETE.map((j) => (
                  <option key={j} value={j} className="bg-zinc-900 text-white">
                    Jud. {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Localitate */}
            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2">
              <Home className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="Oraș / Comună / Sat"
                className="bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Descriere */}
        <div>
          <label className="text-[11px] font-medium text-zinc-400 block mb-1">Descriere Detaliată</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Aproape de intersecția cu str. Principală, pune în pericol traficul..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Captură Foto Directă / Galerie */}
        <div>
          <label className="text-[11px] font-medium text-zinc-400 block mb-1">
            Fotografie din teren (Cameră / Galerie)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />

          {!photoPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border border-dashed border-zinc-800 hover:border-blue-500/50 rounded-xl bg-zinc-950/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition group"
            >
              <div className="p-2.5 rounded-full bg-blue-600/10 text-blue-400 group-hover:scale-110 transition">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs text-zinc-300 font-medium">
                Fă o poză pe teren sau alege din galerie
              </span>
              <span className="text-[10px] text-zinc-500">
                Apasă pentru a deschide camera foto
              </span>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <img
                src={photoPreview}
                alt="Foto sesizare"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/80 text-zinc-300 hover:bg-red-500 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Trimite */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          {loading ? 'Se trimite sesizarea...' : 'Trimite Sesizarea'}
        </button>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Sesizarea a fost înregistrată cu succes și va apărea pe Harta Comunității!</span>
            </div>

            {submittedInstitution && (
              <>
                <p className="text-[11px] text-zinc-300">
                  O notificare a fost transmisă automat către <b>{submittedInstitution.name}</b> (
                  <code className="text-blue-400">{submittedInstitution.email}</code>).
                </p>

                <a
                  href={`mailto:${submittedInstitution.email}?subject=${encodeURIComponent(
                    `[Sesizare Civică OG 27/2002] Sesizare nouă`
                  )}&body=${encodeURIComponent(
                    `Către Registratura ${submittedInstitution.name},\n\nVă aduc la cunoștință o sesizare civică transmisă prin platforma Urbaniq.\n\nVă solicit înregistrarea acesteia și comunicarea numărului de înregistrare.\n\nVă mulțumesc!`
                  )}`}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                >
                  <Mail className="w-4 h-4" />
                  Trimite și din e-mailul tău (Gmail / Apple Mail)
                </a>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
}