/**
 * Sanity connection settings, read from the environment.
 *
 * These are intentionally NOT required — when `NEXT_PUBLIC_SANITY_PROJECT_ID`
 * is missing, the site falls back to the sample catalogue and `/studio` shows
 * a setup notice instead of the editor.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/** True once a project id is configured. */
export const sanityConfigured = projectId.length > 0;
