import { clerkMiddleware } from "@clerk/nextjs/server";

// Standardmäßig schützt clerkMiddleware keine Routen. Die Auth-Prüfung machen
// wir gezielt in der API-Route (/api/generate). Die Middleware muss aber auf
// allen Routen laufen, damit auth() in den Route-Handlern funktioniert.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Next.js-Interna und statische Dateien überspringen
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Immer auf API-Routen laufen
    "/(api|trpc)(.*)",
  ],
};
