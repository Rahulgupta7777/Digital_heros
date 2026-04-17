import type { SupabaseClient } from "@supabase/supabase-js";

export const POOL_RATIO = 0.5;
export const POLICY_ON_EMPTY_TIER = "redistribute_down" as const;

const NUMBER_MIN = 1;
const NUMBER_MAX = 45;
const WINNING_COUNT = 5;

export type RunDrawOptions = {
  monthIso: string;
  mode: "random" | "algorithmic";
  publish?: boolean;
};

export type RunDrawResult = {
  drawId: string;
  winningNumbers: number[];
  totalPool: number;
  pool5: number;
  pool4: number;
  pool3: number;
  rolloverIn: number;
  entriesCount: number;
  fiveMatchCount: number;
  fourMatchCount: number;
  threeMatchCount: number;
  fiveMatchPrize: number;
  fourMatchPrize: number;
  threeMatchPrize: number;
};

export async function runDraw(
  admin: SupabaseClient,
  opts: RunDrawOptions
): Promise<RunDrawResult> {
  const { monthIso, mode, publish = false } = opts;

  const { data: existing } = await admin
    .from("draws")
    .select("*")
    .eq("month", monthIso)
    .eq("status", "simulated")
    .maybeSingle();

  if (existing && !publish) {
    return summarizeExisting(admin, existing.id);
  }

  const { data: activeSubs, error: subsErr } = await admin
    .from("subscriptions")
    .select("user_id, amount, profiles!inner(charity_percentage)")
    .eq("status", "active");

  if (subsErr) throw subsErr;
  if (!activeSubs || activeSubs.length === 0) {
    throw new Error("No active subscribers — cannot run draw.");
  }

  const { data: allScores } = await admin
    .from("scores")
    .select("user_id, score, played_on")
    .in("user_id", activeSubs.map((s) => s.user_id))
    .order("played_on", { ascending: false });

  const scoresByUser = new Map<string, number[]>();
  for (const s of allScores ?? []) {
    const arr = scoresByUser.get(s.user_id) ?? [];
    if (arr.length < 5) arr.push(s.score);
    scoresByUser.set(s.user_id, arr);
  }

  let totalPool = 0;
  for (const sub of activeSubs) {
    const profiles = sub.profiles as unknown as Record<string, unknown> | null;
    const pct = (profiles?.charity_percentage as number | undefined) ?? 10;
    const contribution = Number(sub.amount) * (1 - pct / 100) * POOL_RATIO;
    totalPool += contribution;
  }

  const { data: prevDraw } = await admin
    .from("draws")
    .select("id, rollover_out")
    .lt("month", monthIso)
    .eq("status", "published")
    .order("month", { ascending: false })
    .limit(1)
    .maybeSingle();

  const rolloverIn = Number(prevDraw?.rollover_out ?? 0);
  const grandTotal = totalPool + rolloverIn;

  const pool5 = round2(grandTotal * 0.4);
  const pool4 = round2(grandTotal * 0.35);
  const pool3 = round2(grandTotal * 0.25);

  const winning =
    mode === "random"
      ? generateRandomNumbers()
      : await generateAlgorithmicNumbers(admin);

  type Entry = {
    user_id: string;
    score_numbers: number[];
    match_count: number;
  };

  const entries: Entry[] = [];
  for (const sub of activeSubs) {
    const scores = scoresByUser.get(sub.user_id) ?? [];
    if (scores.length < 5) continue;

    const winSet = new Set(winning);
    const userSet = new Set(scores);
    let match = 0;
    Array.from(userSet).forEach((n) => {
      if (winSet.has(n)) match++;
    });

    entries.push({
      user_id: sub.user_id,
      score_numbers: scores,
      match_count: match,
    });
  }

  const fiveMatches = entries.filter((e) => e.match_count === 5);
  const fourMatches = entries.filter((e) => e.match_count === 4);
  const threeMatches = entries.filter((e) => e.match_count === 3);

  let fiveMatchPrize = 0;
  let rolloverOut = 0;
  if (fiveMatches.length > 0) {
    fiveMatchPrize = round2(pool5 / fiveMatches.length);
  } else {
    rolloverOut = pool5;
  }

  let pool4Effective = pool4;
  let pool3Effective = pool3;
  let fourMatchPrize = 0;
  if (fourMatches.length > 0) {
    fourMatchPrize = round2(pool4Effective / fourMatches.length);
  } else if (POLICY_ON_EMPTY_TIER === "redistribute_down") {
    pool3Effective = round2(pool3Effective + pool4Effective);
    pool4Effective = 0;
  }

  let threeMatchPrize = 0;
  if (threeMatches.length > 0) {
    threeMatchPrize = round2(pool3Effective / threeMatches.length);
  }

  const { data: drawRow, error: drawErr } = await admin
    .from("draws")
    .insert({
      month: monthIso,
      draw_mode: mode,
      winning_numbers: winning,
      prize_pool_total: round2(grandTotal),
      pool_5_match: pool5,
      pool_4_match: pool4Effective,
      pool_3_match: pool3Effective,
      rollover_in: rolloverIn,
      rollover_out: rolloverOut,
      rollover_from_draw_id: prevDraw?.id ?? null,
      status: publish ? "published" : "simulated",
      published_at: publish ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (drawErr) throw drawErr;

  const entriesToInsert = entries
    .filter((e) => e.match_count >= 3)
    .map((e) => ({
      draw_id: drawRow.id,
      user_id: e.user_id,
      score_numbers: e.score_numbers,
      match_count: e.match_count,
      prize_amount:
        e.match_count === 5
          ? fiveMatchPrize
          : e.match_count === 4
            ? fourMatchPrize
            : threeMatchPrize,
    }));

  if (entriesToInsert.length > 0) {
    const { error: entErr } = await admin
      .from("draw_entries")
      .insert(entriesToInsert);
    if (entErr) throw entErr;
  }

  if (publish && entriesToInsert.length > 0) {
    const { data: insertedEntries } = await admin
      .from("draw_entries")
      .select("id, user_id")
      .eq("draw_id", drawRow.id);
    if (insertedEntries) {
      const winnersToInsert = insertedEntries.map((e) => ({
        draw_entry_id: e.id,
        user_id: e.user_id,
      }));
      await admin.from("winners").insert(winnersToInsert);
    }
  }

  return {
    drawId: drawRow.id,
    winningNumbers: winning,
    totalPool: round2(grandTotal),
    pool5,
    pool4: pool4Effective,
    pool3: pool3Effective,
    rolloverIn,
    entriesCount: entriesToInsert.length,
    fiveMatchCount: fiveMatches.length,
    fourMatchCount: fourMatches.length,
    threeMatchCount: threeMatches.length,
    fiveMatchPrize,
    fourMatchPrize,
    threeMatchPrize,
  };
}

function generateRandomNumbers(): number[] {
  const set = new Set<number>();
  while (set.size < WINNING_COUNT) {
    set.add(
      Math.floor(Math.random() * (NUMBER_MAX - NUMBER_MIN + 1)) + NUMBER_MIN
    );
  }
  return Array.from(set).sort((a, b) => a - b);
}

const WEIGHT_RARE = 0.7;

async function generateAlgorithmicNumbers(
  admin: SupabaseClient
): Promise<number[]> {
  const { data: recent } = await admin
    .from("scores")
    .select("score")
    .order("played_on", { ascending: false })
    .limit(2000);

  const freq = new Map<number, number>();
  for (let n = NUMBER_MIN; n <= NUMBER_MAX; n++) freq.set(n, 0);
  for (const r of recent ?? []) {
    freq.set(r.score, (freq.get(r.score) ?? 0) + 1);
  }

  const sorted = Array.from(freq.entries()).sort((a, b) => a[1] - b[1]);
  const rareCount = Math.round(WINNING_COUNT * WEIGHT_RARE);
  const commonCount = WINNING_COUNT - rareCount;

  const rarePool = sorted.slice(0, 15).map(([n]) => n);
  const commonPool = sorted.slice(-15).map(([n]) => n);

  const set = new Set<number>();
  while (set.size < rareCount) {
    set.add(rarePool[Math.floor(Math.random() * rarePool.length)]);
  }
  while (set.size < rareCount + commonCount) {
    set.add(commonPool[Math.floor(Math.random() * commonPool.length)]);
  }
  while (set.size < WINNING_COUNT) {
    set.add(
      Math.floor(Math.random() * (NUMBER_MAX - NUMBER_MIN + 1)) + NUMBER_MIN
    );
  }
  return Array.from(set).sort((a, b) => a - b);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

async function summarizeExisting(
  admin: SupabaseClient,
  drawId: string
): Promise<RunDrawResult> {
  const { data: draw } = await admin
    .from("draws")
    .select("*")
    .eq("id", drawId)
    .single();
  const { data: entries } = await admin
    .from("draw_entries")
    .select("match_count, prize_amount")
    .eq("draw_id", drawId);
  const counts = { 5: 0, 4: 0, 3: 0 } as Record<number, number>;
  const prizes = { 5: 0, 4: 0, 3: 0 } as Record<number, number>;
  for (const e of entries ?? []) {
    counts[e.match_count] = (counts[e.match_count] ?? 0) + 1;
    prizes[e.match_count] = e.prize_amount;
  }
  return {
    drawId,
    winningNumbers: draw!.winning_numbers,
    totalPool: Number(draw!.prize_pool_total),
    pool5: Number(draw!.pool_5_match),
    pool4: Number(draw!.pool_4_match),
    pool3: Number(draw!.pool_3_match),
    rolloverIn: Number(draw!.rollover_in ?? 0),
    entriesCount: entries?.length ?? 0,
    fiveMatchCount: counts[5],
    fourMatchCount: counts[4],
    threeMatchCount: counts[3],
    fiveMatchPrize: prizes[5],
    fourMatchPrize: prizes[4],
    threeMatchPrize: prizes[3],
  };
}
