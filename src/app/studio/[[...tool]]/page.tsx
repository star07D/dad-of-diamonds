/**
 * Embedded Sanity Studio, served at /studio.
 * This is where the catalogue is managed. It has its own login.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { sanityConfigured } from "@/sanity/env";
import { StudioNotConfigured } from "./not-configured";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigured) return <StudioNotConfigured />;
  return <NextStudio config={config} />;
}
