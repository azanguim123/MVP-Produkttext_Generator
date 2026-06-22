"use client";

import { useState } from "react";
import type { GenerierungsErgebnis } from "@/lib/prompts";

function KopierButton({ text, label }: { text: string; label: string }) {
  const [kopiert, setKopiert] = useState(false);
  async function kopieren() {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1500);
    } catch {
      /* Clipboard nicht verfügbar — still ignorieren */
    }
  }
  return (
    <button
      onClick={kopieren}
      className="text-xs font-medium text-accent hover:text-accent-dark transition-colors"
      aria-label={`${label} kopieren`}
    >
      {kopiert ? "Kopiert ✓" : "Kopieren"}
    </button>
  );
}

function Abschnitt({
  label,
  children,
  kopierText,
}: {
  label: string;
  children: React.ReactNode;
  kopierText?: string;
}) {
  return (
    <section className="border-b border-line py-4 last:border-0">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted">
          {label}
        </h3>
        {kopierText !== undefined && <KopierButton text={kopierText} label={label} />}
      </div>
      {children}
    </section>
  );
}

export default function ResultCard({ ergebnis }: { ergebnis: GenerierungsErgebnis }) {
  const allesText = [
    ergebnis.titel,
    "",
    ergebnis.kurzbeschreibung,
    "",
    ...ergebnis.bullets.map((b) => `• ${b}`),
    "",
    ergebnis.beschreibung,
    "",
    `Keywords: ${ergebnis.keywords.join(", ")}`,
  ].join("\n");

  return (
    <div className="rounded-lg border border-line bg-white px-5 py-2">
      <div className="flex items-center justify-between border-b border-line py-3">
        <span className="font-display text-sm font-medium">Ergebnis</span>
        <KopierButton text={allesText} label="Gesamter Text" />
      </div>

      <Abschnitt label="Titel" kopierText={ergebnis.titel}>
        <p className="font-medium">{ergebnis.titel}</p>
      </Abschnitt>

      <Abschnitt label="Kurzbeschreibung" kopierText={ergebnis.kurzbeschreibung}>
        <p className="text-sm text-ink/80">{ergebnis.kurzbeschreibung}</p>
      </Abschnitt>

      {ergebnis.bullets.length > 0 && (
        <Abschnitt
          label="Produktmerkmale"
          kopierText={ergebnis.bullets.map((b) => `• ${b}`).join("\n")}
        >
          <ul className="space-y-1.5">
            {ergebnis.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-accent">▪</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Abschnitt>
      )}

      <Abschnitt label="Beschreibung" kopierText={ergebnis.beschreibung}>
        <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">
          {ergebnis.beschreibung}
        </p>
      </Abschnitt>

      {ergebnis.keywords.length > 0 && (
        <Abschnitt label="Keywords" kopierText={ergebnis.keywords.join(", ")}>
          <div className="flex flex-wrap gap-1.5">
            {ergebnis.keywords.map((k, i) => (
              <span
                key={i}
                className="rounded-full bg-surface px-2.5 py-1 text-xs text-muted"
              >
                {k}
              </span>
            ))}
          </div>
        </Abschnitt>
      )}

      {ergebnis.hinweis && (
        <Abschnitt label="Hinweis">
          <p className="text-xs italic text-muted">{ergebnis.hinweis}</p>
        </Abschnitt>
      )}
    </div>
  );
}
