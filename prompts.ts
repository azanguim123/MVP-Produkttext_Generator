// =============================================================================
// prompts.ts — Das Herzstück des Produkts.
// Hier wird die Qualität der generierten Texte entschieden. Iteriere hier am
// meisten: kleine Änderungen an den System-Prompts = großer Qualitätssprung.
// =============================================================================

export type Plattform = "amazon" | "ebay" | "etsy" | "shopify";
export type Ansprache = "du" | "sie";

export interface GenerierungsInput {
  produktname: string;
  merkmale: string;        // Stichpunkte/Freitext: Eigenschaften, Material, Maße ...
  zielgruppe?: string;     // optional: "junge Eltern", "Hobby-Bäcker" ...
  keywords?: string;       // optional: vom Nutzer gewünschte Suchbegriffe
  plattform: Plattform;
  ansprache: Ansprache;
}

// Erwartetes Ausgabeformat (wird als JSON vom Modell zurückgegeben).
export interface GenerierungsErgebnis {
  titel: string;
  kurzbeschreibung: string; // 1–2 Sätze, ideal als Meta-Description
  bullets: string[];        // 3–6 nutzenorientierte Produktmerkmale
  beschreibung: string;     // ausführlicher Fließtext
  keywords: string[];       // SEO-Keywords / Tags
  hinweis?: string;         // optionaler rechtlicher/qualitativer Hinweis
}

// -----------------------------------------------------------------------------
// Plattform-spezifische Leitlinien. Jede Plattform hat eigene Konventionen.
// -----------------------------------------------------------------------------
const PLATTFORM_LEITLINIEN: Record<Plattform, string> = {
  amazon: `Plattform: Amazon.de
- Titel: präzise, mit Marke (falls vorhanden), Hauptmerkmal und Menge/Maß. Keine Werbephrasen wie "Bestseller".
- Bullets: 4–5 Stichpunkte, jeweils mit einem konkreten NUTZEN (nicht nur Eigenschaft). Stil: kurz, scanbar, mit großgeschriebenem Schlagwort am Anfang.
- Beschreibung: sachlich, vertrauenswürdig, faktenbasiert. Keine übertriebenen Heilsversprechen.
- Keywords: relevante Suchbegriffe, die ein Käufer eingeben würde (inkl. Synonyme).
- Mache keine Versprechen über Haltbarkeit, Lebensdauer oder den zukünftigen Zustand eines Produkts. Bleibe strikt bei den gelieferten Fakten.
`


  ebay: `
  Plattform: eBay.de
- Titel: stark keyword-orientiert, alle wichtigen Suchbegriffe unterbringen (Marke, Typ, Größe, Farbe).
- Bullets: klare Produktdaten und Zustand betonen.
- Beschreibung: strukturiert, scanbar, betont Lieferumfang und wichtige Eckdaten.
- Keywords: viele konkrete Suchvarianten.
- Mache keine Versprechen über Haltbarkeit, Lebensdauer oder den zukünftigen Zustand eines Produkts. Bleibe strikt bei den gelieferten Fakten.
`,

  etsy: `Plattform: Etsy.de
- Titel: emotional und beschreibend, ideal für handgemachte/persönliche Produkte. Geschenk-Anlässe nennen, falls passend.
- Bullets: heben das Besondere, Handgemachte oder Personalisierbare hervor.
- Beschreibung: erzählerisch, warm, schafft eine Vorstellung vom Produkt im Alltag des Käufers.
- Keywords: Tags wie auf Etsy üblich (Stil, Anlass, Empfänger, Material).
- Mache keine Versprechen über Haltbarkeit, Lebensdauer oder den zukünftigen Zustand eines Produkts. Bleibe strikt bei den gelieferten Fakten.
`,

  shopify: `Plattform: eigener Shop (Shopify o. Ä.)
- Titel: klar und markentauglich.
- Bullets: nutzenorientierte Highlights.
- Beschreibung: überzeugender Fließtext mit eigener Markenstimme, SEO-freundlich.
- Keywords: SEO-Keywords für die Produktseite.
- Mache keine Versprechen über Haltbarkeit, Lebensdauer oder den zukünftigen Zustand eines Produkts. Bleibe strikt bei den gelieferten Fakten.
`
,
};

// -----------------------------------------------------------------------------
// System-Prompt: definiert Rolle, Sprache, Format. Auf Deutsch formuliert,
// weil das die Ausgabequalität in deutscher Sprache verbessert.
// -----------------------------------------------------------------------------
export function systemPrompt(plattform: Plattform, ansprache: Ansprache): string {
  const anredeRegel =
    ansprache === "du"
      ? 'Sprich den Kunden mit "du" an (informell, modern).'
      : 'Sprich den Kunden mit "Sie" an (höflich, professionell).';

  return `Du bist ein erfahrener deutschsprachiger E-Commerce-Texter und SEO-Experte.
Du schreibst verkaufsstarke, natürliche Produkttexte für den deutschen Markt.

REGELN:
- Schreibe ausschließlich auf Deutsch, in fehlerfreier, idiomatischer Sprache.
- ${anredeRegel}
- Verkaufe über den NUTZEN, nicht nur über Eigenschaften.
- Keine erfundenen Fakten: nutze nur die vom Nutzer gelieferten Angaben. Erfinde keine Maße, Materialien oder Zertifikate.
- Keine unzulässigen Werbeaussagen (z. B. unbelegte Gesundheitsversprechen).
- Natürlicher Ton, keine Keyword-Stuffing-Aneinanderreihung.

${PLATTFORM_LEITLINIEN[plattform]}

AUSGABEFORMAT:
Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Objekt, ohne Markdown, ohne Backticks, ohne Vor- oder Nachtext. Struktur:
{
  "titel": string,
  "kurzbeschreibung": string,
  "bullets": string[],
  "beschreibung": string,
  "keywords": string[],
  "hinweis": string
}
Das Feld "hinweis" ist optional; nutze es nur, wenn ein kurzer sachlicher Hinweis sinnvoll ist (sonst leeren String).`;
}

// -----------------------------------------------------------------------------
// User-Prompt: die konkreten Produktdaten.
// -----------------------------------------------------------------------------
export function userPrompt(input: GenerierungsInput): string {
  const zeilen = [
    `Produktname: ${input.produktname}`,
    `Merkmale / Eigenschaften: ${input.merkmale}`,
  ];
  if (input.zielgruppe?.trim()) zeilen.push(`Zielgruppe: ${input.zielgruppe}`);
  if (input.keywords?.trim()) zeilen.push(`Gewünschte Keywords: ${input.keywords}`);
  zeilen.push(
    "",
    "Erstelle daraus einen optimierten Produkttext gemäß den Vorgaben und gib NUR das JSON zurück."
  );
  return zeilen.join("\n");
}
