import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Produkttext-Generator – verkaufsstarke Texte für deinen Shop",
  description:
    "Erstelle in Sekunden optimierte deutsche Produktbeschreibungen für Amazon, eBay, Etsy und deinen eigenen Shop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="de" className={`${display.variable} ${body.variable}`}>
        <body className="font-body">
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="font-display text-sm font-medium">
              Produkttext-Generator
            </span>
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-sm text-muted hover:text-ink">
                    Anmelden
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-md bg-ink px-3 py-1.5 text-sm text-paper">
                    Registrieren
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
