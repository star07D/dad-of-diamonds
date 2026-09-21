import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "../env";
import { planSold, type MarkSoldResult, type ProductRow } from "./plan-sold";

export type { MarkSoldResult };

const token = process.env.SANITY_API_WRITE_TOKEN;

/** True when the site can write back to Sanity (needs an Editor-role token). */
export const sanityWriteConfigured = sanityConfigured && Boolean(token);

/**
 * Marks pieces as sold after a successful Stripe payment. Idempotent: Stripe
 * retries webhooks, so a piece already stamped with this payment's session id
 * is left alone. Patches are pinned to the revision we read, so two
 * simultaneous deliveries can't both win — the loser throws and Stripe retries.
 */
export async function markSold(
  ids: string[],
  sessionId: string,
): Promise<MarkSoldResult> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const rows = await client.fetch<ProductRow[]>(
    `*[_type == "product" && _id in $ids]{_id, _rev, name, status, stripeSessionId}`,
    { ids },
  );

  const result = planSold(ids, rows, sessionId);

  if (result.sold.length > 0) {
    const tx = client.transaction();
    for (const s of result.sold) {
      tx.patch(s.id, {
        ifRevisionID: s.rev,
        set: { status: "sold", stripeSessionId: sessionId },
      });
    }
    await tx.commit();
  }
  return result;
}
