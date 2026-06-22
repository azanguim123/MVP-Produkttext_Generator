import GeneratorForm from "@/components/GeneratorForm";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-accent">
          Produkttext-Generator
        </p>
        <h1 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
          Verkaufsstarke Produkttexte.
          <br />
          In Sekunden, auf Deutsch.
        </h1>
        <p className="mt-4 text-muted">
          Aus ein paar Eckdaten wird ein optimierter Text für Amazon, eBay, Etsy
          oder deinen eigenen Shop – im passenden Ton, mit Keywords.
        </p>
      </header>

      <GeneratorForm />

      <footer className="mt-12 border-t border-line pt-5 text-xs text-muted">
        Hinweis: Erstellte Texte vor Veröffentlichung prüfen. · Impressum ·
        Datenschutz
      </footer>
    </main>
  );
}
