// lib/institutionsEmailMap.ts

interface InstitutionContact {
  email: string;
  name: string;
}

const INSTITUTION_EMAILS: Record<string, Record<string, InstitutionContact>> = {
  Cluj: {
    'Cluj-Napoca': { email: 'registratura@primariaclujnapoca.ro', name: 'Primăria Municipiului Cluj-Napoca' },
    Florești: { email: 'registratura@floresti-cluj.ro', name: 'Primăria Comunei Florești' },
    Turda: { email: 'contact@primariaturda.ro', name: 'Primăria Municipiului Turda' },
  },
  București: {
    'Sector 1': { email: 'registratura@primariasector1.ro', name: 'Primăria Sectorului 1 București' },
    'Sector 2': { email: 'infopublice@ps2.ro', name: 'Primăria Sectorului 2 București' },
    'Sector 3': { email: 'p3@primarie3.ro', name: 'Primăria Sectorului 3 București' },
  },
  Iași: {
    Iași: { email: 'informatii@primaria-iasi.ro', name: 'Primăria Municipiului Iași' },
  },
  Botoșani: {
    Botoșani: { email: 'primaria@primariabt.ro', name: 'Primăria Municipiului Botoșani' },
    Vorona: { email: 'primaria.vorona@yahoo.com', name: 'Primăria Comunei Vorona' },
  },
};

export function getInstitutionEmail(county: string, locality: string): InstitutionContact {
  const countyData = INSTITUTION_EMAILS[county];
  if (countyData && countyData[locality]) {
    return countyData[locality];
  }

  // Fallback generat dinamic dacă localitatea nu este în dicționar
  const cleanLocality = locality.toLowerCase().replace(/[^a-z0-9]/g, '');
  return {
    email: `registratura@primaria-${cleanLocality}.ro`,
    name: `Primăria ${locality} (Jud. ${county})`,
  };
}