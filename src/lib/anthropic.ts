import Anthropic from "@anthropic-ai/sdk";

// Der API-Key wird aus der Umgebungsvariable gelesen (siehe .env.local).
// NIEMALS den Key im Frontend-Code ablegen — nur serverseitig (API-Route).
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Modell-IDs sind in Produktion als feste Snapshots zu verwenden (pinned),
// damit sich das Verhalten nicht unangekündigt ändert.
//
// Standard: Haiku 4.5 — schnellstes und günstigstes Modell ($1/$5 pro Mio. Tokens).
// Premium-Stufe (optional, höhere Qualität): "claude-sonnet-4-6".
export const MODELL_STANDARD = "claude-haiku-4-5-20251001";
export const MODELL_PREMIUM = "claude-sonnet-4-6";

export const MAX_TOKENS = 1200;
