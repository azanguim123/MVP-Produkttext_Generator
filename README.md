# Produkttext-Generator (MVP)

KI-gestützter Generator für deutsche Produktbeschreibungen (Amazon, eBay, Etsy, eigener Shop).
Dies ist der Kern aus Woche 2: der Generierungs-Flow. Auth und Bezahlung folgen in Woche 3–4.

## Schnellstart

```bash
npm install
cp .env.local.example .env.local   # dann ANTHROPIC_API_KEY eintragen
npm run dev
```

Öffne http://localhost:3000

Den API-Key bekommst du auf https://console.anthropic.com — lege dort ein
Ausgabe-Limit fest, damit die Kosten gedeckelt sind.

## Wo du arbeitest

- `src/lib/prompts.ts` — **das Herzstück.** Hier werden die Texte gut oder mittel.
  Iteriere hier am meisten (Ton, Plattform-Regeln, Ausgabeformat).
- `src/lib/anthropic.ts` — Modellwahl. Standard: Haiku 4.5 (günstig/schnell).
  Für eine Premium-Stufe `MODELL_PREMIUM` (Sonnet 4.6) nutzen.
- `src/app/api/generate/route.ts` — serverseitiger Aufruf + Validierung.
- `src/components/` — Eingabeformular und Ergebnisanzeige.

## Deployment

Auf Vercel deployen, `ANTHROPIC_API_KEY` als Environment-Variable hinterlegen.

## Nächste Schritte (geplant)

- Woche 3: Auth + Nutzungszähler (Freemium-Limit)
- Woche 4: Landingpage, Bezahlung (Digistore24), Rechtsseiten (Impressum,
  Datenschutz, Widerrufs-Verzicht), Launch
- Optional: Streaming für bessere UX, Verlauf/Speichern, Sonnet-Premiumstufe
