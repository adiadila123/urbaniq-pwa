// components/NotificationPrompt.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';

export default function NotificationPrompt() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
    } else {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;

    const res = await Notification.requestPermission();
    setPermission(res);

    if (res === 'granted') {
      new Notification('Urbaniq Activat! 🔔', {
        body: 'Vei primi actualizări când sesizările din zona ta sunt rezolvate de primărie.',
        icon: '/favicon.ico',
      });
    }
  };

  if (permission === 'granted' || permission === 'unsupported' || dismissed) return null;

  return (
    <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-semibold text-white">Activează Notificările Civice</h4>
          <p className="text-[10px] text-zinc-400">Primești alertă când se rezolvă o problemă în zona ta.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={requestPermission}
          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-[10px] transition"
        >
          Permite
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}