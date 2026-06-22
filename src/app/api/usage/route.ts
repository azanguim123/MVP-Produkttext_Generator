import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { statusAbrufen } from "@/lib/usage";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ fehler: "Nicht angemeldet." }, { status: 401 });
  }
  const status = await statusAbrufen(userId);
  return NextResponse.json(status);
}
