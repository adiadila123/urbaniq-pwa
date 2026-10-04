// app/ghid/cerere/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Download, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { generatePetitionPdf, RequestType } from '@/lib/pdf/generatePetition';

const CERERI_TYPES = [
  { id: 'petition', name: 'Sesizare / Petiție Generală', institution: 'Primăria Locală', defaultText: 'Vă aduc la cunoștință următoarea problemă din comunitate și vă solicit intervenția...' },
  { id: 'bulletin', name: 'Eliberare Act de Identitate (Buletin)', institution: 'SPCLEP - Evidența Persoanelor', defaultText: 'Solicit eliberarea unui nou act de identitate ca urmare a expirării / schimbării domiciliului...' },
  { id: 'parking', name: 'Atribuire Loc de Parcare Rezidențială', institution: 'Direcția Patrimoniu / Primărie', defaultText: 'Solicit atribuirea unui loc de parcare rezidențial pentru autoturismul cu nr. de înmatriculare...' },
  { id: 'certificate', name: 'Adeverință Rol / Taxe și Impozite', institution: 'Direcția Impozite și Taxe Locale', defaultText: 'Solicit eliberarea unei adeverințe privind situația fiscală / veniturile / bunurile mobile...' },
];

export default function GeneratorCererePage() {
  const searchParams = useSearchParams();
  const initialInstitution = searchParams.get('institution') || '';

  const [requestType, setRequestType] = useState<RequestType>('petition');
  const [formData, setFormData] = useState({
    fullName: '',
    cnp: '',
    address: '',
    institution: initialInstitution || CERERI_TYPES[0].institution,
    subject: CERERI_TYPES[0].defaultText,
  });

  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Setează instituția extrasă din parametrii URL dacă este prezentă
  useEffect(() => {
    if (initialInstitution) {
      setFormData((prev) => ({ ...prev, institution: initialInstitution }));
    }
  }, [initialInstitution]);

  const handleTypeChange = (typeId: RequestType) => {
    setRequestType(typeId);
    const selected = CERERI_TYPES.find((c) => c.id === typeId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        institution: initialInstitution || selected.institution,
        subject: selected.defaultText,
      }));
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.subject) return;

    setGenerating(true);
    try {
      const pdfBytes = await generatePetitionPdf({ ...formData, requestType });
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `Cerere_${requestType}_${formData.fullName.replace(/\s+/g, '_')}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      console.error('Eroare generare PDF:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto space-y-5 pb-24">
      <div className="flex items-center gap-3">
        <Link href="/ghid" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Generator Cereri Tipizate
          </h1>
          <p className="text-xs text-zinc-400">Alege tipul cererii și descarcă documentul A4.</p>
        </div>
      </div>

      <form onSubmit={handleDownload} className="space-y-3.5 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-xl">
        {/* Tip Cerere */}
        <div>
          <label className="text-[11px] font-medium text-zinc-400 block mb-1">Tipul Cererii</label>
          <select
            value={requestType}
            onChange={(e) => handleTypeChange(e.target.value as RequestType)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            {CERERI_TYPES.map((type) => (
              <option key={type.id} value={type.id} className="bg-zinc-900 text-white">
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Instituție Destinatară */}
        <div>
          <label className="text-[11px] text-zinc-400 block mb-1">Instituția Destinatară</label>
          <input
            type="text"
            required
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            placeholder="Ex: Primăria Municipiului / SPCLEP"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Nume Complet */}
        <div>
          <label className="text-[11px] text-zinc-400 block mb-1">Nume și Prenume Complet</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Ion Popescu"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* CNP și Adresă */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">CNP</label>
            <input
              type="text"
              required
              value={formData.cnp}
              onChange={(e) => setFormData({ ...formData, cnp: e.target.value })}
              placeholder="1901010123456"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Adresă Domiciliu</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Str. Principală Nr. 1"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Text Solicitare */}
        <div>
          <label className="text-[11px] text-zinc-400 block mb-1">Solicitarea Detaliată</label>
          <textarea
            required
            rows={4}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Buton Deschidere Locație în Hărți */}
        {formData.institution && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${formData.institution}${formData.address}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            Vezi Sediul Instituției pe Hartă
          </a>
        )}

        {/* Buton Descărcare PDF */}
        <button
          type="submit"
          disabled={generating}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {generating ? 'Se generează PDF-ul...' : 'Descarcă Cererea PDF Tipizată'}
        </button>

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Cererea a fost generată și descărcată cu succes!
          </div>
        )}
      </form>
    </div>
  );
}