import { NextResponse } from "next/server";
import { healthReport } from "@/lib/health";

/**
 * What's configured, as yes/no — see src/lib/health.ts. Read by
 * `npm run check-live`. Never includes a secret's value.
 */
export function GET() {
  return NextResponse.json(healthReport(process.env), {
    headers: { "Cache-Control": "no-store" },
  });
}
