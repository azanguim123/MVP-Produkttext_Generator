"use client";

import { useState } from "react";
import type {
  GenerierungsErgebnis,
  Plattform,
  Ansprache,
} from "@/lib/prompts";
import ResultCard from "./ResultCard";

const PLATTFORMEN: { wert: Plattform; label: string }[] = [
  { wert: "amazon", label: "Amazon" },
  { wert: "ebay", label: "eBay" },
  { wert: "etsy", label: "Etsy" },
  { wert: "shopify", label: "Eigener Shop" },
];

const feldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm placeholder:text-muted/60 focus:border-accent";
const labelClass =
  "mb-1.5 block font-display text-xs uppercase tracking-widest text-muted";

export default function GeneratorForm() {
  const [produktname, setProduktname] = useState("");
  const [merkmale, setMerkmale] = useState("");
  const [zielgruppe, setZielgruppe] = useState("");
  const [keywords, setKeywords] = useState("");
  const [plattform, setPlattform] = useState<Plattform>("amazon");
  const [ansprache, setAnsprache] = useState<Ansprache>("du");

  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<GenerierungsErgebnis | null>(null);

  async function generieren() {
    setFehler(null);
    if (!produktname.trim() || !merkmale.trim()) {
      setFehler("Bitte Produktname und Merkmale ausfüllen.");
      return;
    }
    setLaedt(true);
    setErgebnis(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produktname,
          merkmale,
          zielgruppe,
          keywords,
          plattform,
          ansprache,
        }),
      });
      const daten = await res.json();
      if (!res.ok) {
        setFehler(daten.fehler ?? "Etwas ist schiefgelaufen.");
      } else {
        setErgebnis(daten.ergebnis);
      }
    } catch {
      setFehler("Verbindung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Eingabe */}
      <div className="rounded-lg border border-line bg-white p-5">
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="produktname">
              Produktname
            </label>
            <input
              id="produktname"
              className={feldClass}
              value={produktname}
              onChange={(e) => setProduktname(e.target.value)}
              placeholder="z. B. Edelstahl-Trinkflasche 750 ml"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="merkmale">
              Merkmale & Eigenschaften
            </label>
            <textarea
              id="merkmale"
              rows={4}
              className={feldClass}
              value={merkmale}
              onChange={(e) => setMerkmale(e.target.value)}
              placeholder="Material, Maße, Besonderheiten, Lieferumfang ..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="zielgruppe">
                Zielgruppe (optional)
              </label>
              <input
                id="zielgruppe"
                className={feldClass}
                value={zielgruppe}
                onChange={(e) => setZielgruppe(e.target.value)}
                placeholder="z. B. Outdoor-Fans"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="keywords">
                Keywords (optional)
              </label>
              <input
                id="keywords"
                className={feldClass}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="z. B. auslaufsicher, BPA-frei"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="plattform">
                Plattform
              </label>
              <select
                id="plattform"
                className={feldClass}
                value={plattform}
                onChange={(e) => setPlattform(e.target.value as Plattform)}
              >
                {PLATTFORMEN.map((p) => (
                  <option key={p.wert} value={p.wert}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Ansprache</label>
              <div className="flex rounded-md border border-line p-0.5">
                {(["du", "sie"] as Ansprache[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAnsprache(a)}
                    className={`flex-1 rounded px-3 py-1.5 text-sm transition-colors ${
                      ansprache === a
                        ? "bg-ink text-paper"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {a === "du" ? "Du" : "Sie"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {fehler && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {fehler}
            </p>
          )}

          <button
            onClick={generieren}
            disabled={laedt}
            className="w-full rounded-md bg-accent px-4 py-2.5 font-medium text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {laedt ? "Wird erstellt …" : "Produkttext erstellen"}
          </button>
        </div>
      </div>

      {/* Ergebnis */}
      <div>
        {ergebnis ? (
          <ResultCard ergebnis={ergebnis} />
        ) : (
          <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-dashed border-line p-8 text-center">
            <p className="max-w-xs text-sm text-muted">
              Fülle die Felder aus und erstelle deinen Produkttext. Das Ergebnis
              erscheint hier.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
