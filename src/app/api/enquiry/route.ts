import { NextResponse } from "next/server";
import { resend, resendConfigured, RESEND_FROM } from "@/lib/resend";
import { SITE } from "@/lib/site";

interface Body {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  items?: unknown;
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

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const message = str(body.message, 4000);
  const items = Array.isArray(body.items)
    ? body.items.filter((x): x is string => typeof x === "string").slice(0, 20)
    : [];

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email and a message." },
      { status: 400 },
    );
  }
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

  const itemLinks = items
    .map((slug) => `${SITE.url}/product/${slug}`)
    .join("\n");

  const text = [
    `New enquiry from the website`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    itemLinks ? `\nPiece(s):\n${itemLinks}` : "",
    ``,
    `Message:`,
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: SITE.email,
      replyTo: email,
      subject: items.length ? "Enquiry about a piece" : `Enquiry from ${name}`,
      text,
    });
    if (error) {
      console.error("[enquiry] Resend error:", error);
      return NextResponse.json(
        { error: "Could not send right now. Please try WhatsApp instead." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[enquiry] send failed:", err);
    return NextResponse.json(
      { error: "Could not send right now. Please try WhatsApp instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
