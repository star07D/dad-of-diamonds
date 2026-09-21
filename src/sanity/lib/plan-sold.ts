export interface ProductRow {
  _id: string;
  _rev: string;
  name: string;
  status: string;
  stripeSessionId?: string;
}

export interface MarkSoldResult {
  /** Newly marked as sold by this payment. */
  sold: Array<{ id: string; name: string; rev: string }>;
  /** Already marked by this exact payment — a repeated webhook delivery. */
  duplicates: string[];
  /** Already sold to someone else — this payment needs a manual refund. */
  conflicts: Array<{ id: string; name: string }>;
  /** Ids that don't exist in the CMS. */
  missing: string[];
}

/** Pure decision step: what should a paid Stripe session do to these pieces? */
export function planSold(
  ids: string[],
  rows: ProductRow[],
  sessionId: string,
): MarkSoldResult {
  const result: MarkSoldResult = {
    sold: [],
    duplicates: [],
    conflicts: [],
    missing: ids.filter((id) => !rows.some((r) => r._id === id)),
  };
  for (const row of rows) {
    if (row.stripeSessionId === sessionId) result.duplicates.push(row._id);
    else if (row.status === "sold")
      result.conflicts.push({ id: row._id, name: row.name });
    else result.sold.push({ id: row._id, name: row.name, rev: row._rev });
  }
  return result;
}
