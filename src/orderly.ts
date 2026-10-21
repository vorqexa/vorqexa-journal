// Orderly Public Info API: zero-auth, read-only, queried by wallet address.
const API = "https://api.orderly.org/v1/public/query";

export type Fill = {
  id: string;
  order_id: string | null;
  symbol: string;
  side: "BUY" | "SELL";
  executed_price: string;
  executed_quantity: string;
  fee: string;
  fee_asset: string;
  is_maker: boolean;
  realized_pnl: string | null;
  executed_timestamp: number;
};

type TradesResponse = {
  success: boolean;
  message?: string;
  data?: { rows: Fill[]; next_cursor: string | null };
};

export const isEvmAddress = (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v.trim());

async function query<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 429) throw new Error("Rate limit reached. Wait a minute and try again.");
  if (!res.ok) throw new Error(`Orderly API error (HTTP ${res.status}).`);
  return (await res.json()) as T;
}

// Fetch a wallet's fills for the last `days` days, newest first, following the cursor.
export async function fetchFills(address: string, days = 90, maxPages = 25): Promise<Fill[]> {
  const end = Date.now();
  const start = end - days * 86_400_000;
  const byId = new Map<string, Fill>();
  let cursor: string | null = null;

  for (let page = 0; page < maxPages; page++) {
    const body: Record<string, unknown> = {
      type: "trades",
      address: address.trim(),
      start_time: start,
      end_time: end,
      limit: 1000,
    };
    if (cursor) body.cursor = cursor;

    const json = await query<TradesResponse>(body);
    if (!json.success || !json.data) throw new Error(json.message ?? "Orderly returned an error.");

    for (const row of json.data.rows) byId.set(row.id, row);
    cursor = json.data.next_cursor;
    if (!cursor || json.data.rows.length === 0) break;
  }

  return [...byId.values()].sort((a, b) => b.executed_timestamp - a.executed_timestamp);
}
