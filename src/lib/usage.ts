import { clerkClient } from "@clerk/nextjs/server";

// Kostenlose Generierungen pro Monat. Hier später die Logik für bezahlte
// Tarife andocken (z. B. höheres Limit für zahlende Nutzer).
export const GRATIS_LIMIT = 2;

export interface NutzungsStatus {
  verbleibend: number;
  limit: number;
  ueberschritten: boolean;
}

function aktuellePeriode(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function leseNutzung(meta: unknown): { used: number; period: string } {
  const m = (meta ?? {}) as Record<string, unknown>;
  return {
    used: typeof m.used === "number" ? m.used : 0,
    period: typeof m.period === "string" ? m.period : "",
  };
}

function baueStatus(genutzt: number): NutzungsStatus {
  const verbleibend = Math.max(0, GRATIS_LIMIT - genutzt);
  return { verbleibend, limit: GRATIS_LIMIT, ueberschritten: verbleibend <= 0 };
}

// Aktuellen Status lesen (mit monatlichem Reset).
export async function statusAbrufen(userId: string): Promise<NutzungsStatus> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const { used, period } = leseNutzung(user.privateMetadata);
  const genutzt = period === aktuellePeriode() ? used : 0;
  return baueStatus(genutzt);
}

// Zähler um 1 erhöhen (mit monatlichem Reset) und neuen Status zurückgeben.
export async function nutzungErhoehen(userId: string): Promise<NutzungsStatus> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const { used, period } = leseNutzung(user.privateMetadata);
  const aktuell = aktuellePeriode();
  const neu = (period === aktuell ? used : 0) + 1;
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { used: neu, period: aktuell },
  });
  return baueStatus(neu);
}
