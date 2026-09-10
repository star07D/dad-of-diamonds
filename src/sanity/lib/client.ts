import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "../env";

let cached: SanityClient | null = null;

/**
 * Returns the Sanity client, or throws if the project isn't configured.
 * Callers should check `sanityConfigured` first (the products loader does).
 */
export function getClient(): SanityClient {
  if (!sanityConfigured) {
    throw new Error("Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID)");
  }
  cached ??= createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
  });
  return cached;
}
