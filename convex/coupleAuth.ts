import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireMaster } from "./roles";

const COUPLE_ID_KEY = "coupleId";

/** Generate a random alphanumeric ID (12 chars). */
function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No confusing chars (0,O,1,I)
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  for (let i = 0; i < 12; i++) {
    id += chars[bytes[i]! % chars.length];
  }
  return id;
}

async function getStoredCoupleId(ctx: QueryCtx) {
  const row = await ctx.db
    .query("siteConfig")
    .withIndex("by_key", (q) => q.eq("key", COUPLE_ID_KEY))
    .first();
  return row?.value ?? null;
}

/** Check if a Couple ID exists (for bootstrap). Public - no auth. */
export const exists = query({
  args: {},
  handler: async (ctx) => {
    const stored = await getStoredCoupleId(ctx);
    return !!stored;
  },
});

/**
 * Bootstrap: Create Couple ID when none exists. No auth required.
 * Use this from Admin when the site hasn't been set up yet.
 * Only works if no Couple ID exists - otherwise throws.
 */
export const bootstrap = mutation({
  args: {},
  handler: async (ctx) => {
    const stored = await getStoredCoupleId(ctx);
    if (stored) throw new Error("Couple ID already exists. Use the existing one or get it from the site owner.");
    const id = generateId();
    await ctx.db.insert("siteConfig", { key: COUPLE_ID_KEY, value: id });
    return id;
  },
});

/** Master only: generate or get the Couple ID. Auto-creates if missing. */
export const getOrGenerate = mutation({
  args: {},
  handler: async (ctx) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can access Couple ID");
    let stored = await getStoredCoupleId(ctx);
    if (!stored) {
      stored = generateId();
      await ctx.db.insert("siteConfig", { key: COUPLE_ID_KEY, value: stored });
    }
    return stored;
  },
});

/** Master only: get the Couple ID (read-only, does not create). */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const me = await requireMaster(ctx);
    if (!me) return null;
    return await getStoredCoupleId(ctx);
  },
});

/** Verify a Couple ID. Returns true if valid. Does not expose the actual ID. */
export const verify = query({
  args: { candidateId: v.string() },
  handler: async (ctx, args) => {
    const stored = await getStoredCoupleId(ctx);
    if (!stored) return false;
    return args.candidateId.trim().toUpperCase() === stored.toUpperCase();
  },
});

/** For use by other Convex handlers: check if candidate is valid Couple ID. */
export async function isValidCoupleId(ctx: QueryCtx, candidateId: string): Promise<boolean> {
  const stored = await getStoredCoupleId(ctx);
  if (!stored) return false;
  return candidateId.trim().toUpperCase() === stored.toUpperCase();
}
