import { NextResponse } from "next/server";
import { resend, resendConfigured, RESEND_FROM } from "@/lib/resend";
import { SITE } from "@/lib/site";

interface Body {
  email?: unknown;
  /** slug of a reserved/sold piece the visitor wants an alert about */
  piece?: unknown;
  /** honeypot — real visitors never fill this in */
  company?: unknown;
  /** ms since the form was rendered — filters instant bot submits */
  startedAt?: unknown;
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: a filled-in hidden field means it's a bot. Pretend success.
  if (str(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const email = str(body.email, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  // Too fast to be human — silently accept without sending.
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (startedAt && Date.now() - startedAt < 1500) {
    return NextResponse.json({ ok: true });
  }

  if (!resendConfigured || !resend) {
    return NextResponse.json({ configured: false });
  }

  const rawPiece = str(body.piece, 200);
  const piece = /^[a-z0-9-]+$/.test(rawPiece) ? rawPiece : "";

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: SITE.email,
      replyTo: email,
      subject: piece ? "Piece alert request" : "New arrivals signup",
      text: piece
        ? `Alert request for:\n${SITE.url}/product/${piece}\n\nEmail: ${email}`
        : `New arrivals signup:\n${email}`,
    });
    if (error) {
      console.error("[subscribe] Resend error:", error);
      return NextResponse.json(
        { error: "Could not sign up right now. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[subscribe] send failed:", err);
    return NextResponse.json(
      { error: "Could not sign up right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
