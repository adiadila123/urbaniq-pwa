// app/actions/guide.ts
'use server';

import { Groq } from 'groq-sdk';

export async function askCivicAssistantAction(
  userQuery: string,
  county: string = 'România',
  locality: string = ''
) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('cheia_ta')) {
    return {
      success: false,
      message: 'Cheia GROQ_API_KEY nu este setată corect în fișierul .env.local.',
    };
  }

  const locationContext = locality.trim()
    ? `${locality.trim()}, județul ${county}`
    : `județul ${county}`;

  try {
    const groq = new Groq({ apiKey });

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Ești un asistent civic oficial din România, foarte amabil, clar și complet.
Răspunde detaliat în limba română la problema cetățeanului, adaptat specific pentru zona: "${locationContext}".

Reține: Dacă cetățeanul este dintr-un sat sau o comună, menționează dacă trebuie să meargă la Primăria Comunală locală sau dacă este necesară deplasarea la orașul reședință de județ / municipiu (ex: pentru Pașapoarte, SPCLEP sau Cazier).

Explică pas cu pas:
1. Ce are de făcut și la ce instituție competentă trebuie să meargă pentru locația "${locationContext}".
2. Lista completă a actelor necesare (bullet points).
3. Informații utile despre taxe, reducere de termen (dacă se aplică) și opțiuni de plată/depunere online (ex: Ghiseul.ro / portalul primăriei locale).

La finalul răspunsului, adaugă un singur rând separat exact în acest format:
📍 CĂUTARE MAPS: [Termen exact de căutare pentru Google Maps incluzând instituția, localitatea și județul, ex: Primaria comunei Floresti Cluj sau SPCLEP Botosani]`,
        },
        { role: 'user', content: userQuery },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.2, // Răspunsuri mai precise pe instrucțiuni de format
    });

    const answer = response.choices[0]?.message?.content;

    if (!answer) {
      return { success: false, message: 'Modelul AI nu a generat niciun răspuns.' };
    }

    return { success: true, answer };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Eroare necunoscută la conectarea Groq.';
    return { success: false, message: `Eroare Groq: ${errorMsg}` };
  }
}