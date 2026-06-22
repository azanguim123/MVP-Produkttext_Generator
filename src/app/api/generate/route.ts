import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELL_STANDARD, MAX_TOKENS } from "@/lib/anthropic";
import {
  systemPrompt,
  userPrompt,
  type GenerierungsInput,
  type GenerierungsErgebnis,
  type Plattform,
  type Ansprache,
} from "@/lib/prompts";

export const runtime = "nodejs";

const GUELTIGE_PLATTFORMEN: Plattform[] = ["amazon", "ebay", "etsy", "shopify"];
const GUELTIGE_ANSPRACHEN: Ansprache[] = ["du", "sie"];

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { fehler: "Server ist nicht konfiguriert (API-Key fehlt)." },
      { status: 500 }
    );
  }

  let body: Partial<GenerierungsInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fehler: "Ungültige Anfrage." }, { status: 400 });
  }

  // --- Eingaben validieren ---------------------------------------------------
  const produktname = (body.produktname ?? "").trim();
  const merkmale = (body.merkmale ?? "").trim();
  const plattform = body.plattform as Plattform;
  const ansprache = (body.ansprache as Ansprache) ?? "du";

  if (!produktname || !merkmale) {
    return NextResponse.json(
      { fehler: "Bitte Produktname und Merkmale angeben." },
      { status: 400 }
    );
  }
  if (!GUELTIGE_PLATTFORMEN.includes(plattform)) {
    return NextResponse.json({ fehler: "Unbekannte Plattform." }, { status: 400 });
  }
  if (!GUELTIGE_ANSPRACHEN.includes(ansprache)) {
    return NextResponse.json({ fehler: "Ungültige Ansprache." }, { status: 400 });
  }

  const input: GenerierungsInput = {
    produktname,
    merkmale,
    zielgruppe: body.zielgruppe?.trim(),
    keywords: body.keywords?.trim(),
    plattform,
    ansprache,
  };

  // --- LLM aufrufen ----------------------------------------------------------
  try {
    const antwort = await anthropic.messages.create({
      model: MODELL_STANDARD,
      max_tokens: MAX_TOKENS,
      system: systemPrompt(plattform, ansprache),
      messages: [{ role: "user", content: userPrompt(input) }],
    });

    const text = antwort.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { text: string }).text)
      .join("")
      .trim();

    const ergebnis = parseErgebnis(text);
    if (!ergebnis) {
      return NextResponse.json(
        { fehler: "Antwort konnte nicht verarbeitet werden. Bitte erneut versuchen." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ergebnis });
  } catch (err) {
    console.error("Generierungsfehler:", err);
    return NextResponse.json(
      { fehler: "Bei der Generierung ist ein Fehler aufgetreten." },
      { status: 502 }
    );
  }
}

// JSON robust aus der Modellantwort lesen (auch falls doch Backticks drumherum).
function parseErgebnis(text: string): GenerierungsErgebnis | null {
  let roh = text;
  const start = roh.indexOf("{");
  const ende = roh.lastIndexOf("}");
  if (start !== -1 && ende !== -1 && ende > start) {
    roh = roh.slice(start, ende + 1);
  }
  try {
    const obj = JSON.parse(roh);
    return {
      titel: String(obj.titel ?? ""),
      kurzbeschreibung: String(obj.kurzbeschreibung ?? ""),
      bullets: Array.isArray(obj.bullets) ? obj.bullets.map(String) : [],
      beschreibung: String(obj.beschreibung ?? ""),
      keywords: Array.isArray(obj.keywords) ? obj.keywords.map(String) : [],
      hinweis: obj.hinweis ? String(obj.hinweis) : undefined,
    };
  } catch {
    return null;
  }
}
