// lib/gamification.ts

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export function getUserCivicStats() {
  if (typeof window === 'undefined') return { reportsCount: 0, upvotesCount: 0, petitionsCount: 0 };

  const reportsCount = parseInt(localStorage.getItem('urbaniq_reports_count') || '0', 10);
  const upvotesCount = parseInt(localStorage.getItem('urbaniq_upvotes_count') || '0', 10);
  const petitionsCount = parseInt(localStorage.getItem('urbaniq_petitions_count') || '0', 10);

  return { reportsCount, upvotesCount, petitionsCount };
}

export function incrementCivicStat(type: 'reports' | 'upvotes' | 'petitions') {
  if (typeof window === 'undefined') return;

  const key = `urbaniq_${type}_count`;
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  localStorage.setItem(key, (current + 1).toString());
}

export function getCivicBadges(): Badge[] {
  const { reportsCount, upvotesCount, petitionsCount } = getUserCivicStats();

  return [
    {
      id: 'first_report',
      name: 'Prima Sesizare',
      description: 'Ai trimis prima ta sesizare pe teren.',
      icon: '🌱',
      unlocked: reportsCount >= 1,
    },
    {
      id: 'active_reporter',
      name: 'Cetățean Activ',
      description: 'Ai raportat cel puțin 5 probleme din comunitate.',
      icon: '📢',
      unlocked: reportsCount >= 5,
    },
    {
      id: 'supporter',
      name: 'Susținător Civic',
      description: 'Ai acordat 3 voturi (+1) pe Harta Comunității.',
      icon: '❤️',
      unlocked: upvotesCount >= 3,
    },
    {
      id: 'petition_master',
      name: 'Luptător cu Burocrația',
      description: 'Ai generat cel puțin o petiție PDF oficială.',
      icon: '📜',
      unlocked: petitionsCount >= 1,
    },
  ];
}