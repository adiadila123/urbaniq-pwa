# 🌆 Urbaniq PWA

**Urbaniq** este o aplicație mobilă de tip Progressive Web App (PWA) destinată raportării și monitorizării problemelor urbane în timp real. Permite cetățenilor să trimită sesizări (gropi, iluminat defect, deșeuri), să consulte un ghid civic alimentat de AI și să vizualizeze stadiul intervențiilor pe o hartă interactivă.

---

## 🚀 Tehnologii Utilizate

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Server Components)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Fixed Dark Theme Native)
* **Limbaj:** TypeScript
* **Bază de date:** [Neon PostgreSQL](https://neon.tech/) (Serverless)
* **Interfață UI:** Lucide React Icons
* **PWA:** Suport offline, stocare locală IndexedDB și manifest PWA pentru instalare pe ecranul principal.

---

## 🎨 Design & Arhitectură UI

* **Dark Mode Nativ:** Aplicația folosește un sistem vizual exclusiv întunecat (paleta `bg-zinc-950` / `bg-zinc-900`) pentru un consum redus de baterie pe ecrane OLED și o experiență cinematică mobilă.
* **Client Shell Pattern:** Separare clară între Server Components (`layout.tsx`) și interfețele interactive pe client (`ClientShell`, `SplashScreen`, `BottomNav`).

---

## 📦 Structura Proiectului