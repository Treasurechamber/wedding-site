import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireMaster } from "./roles";
import { auth } from "./auth";

const INVITE_KEY = "masterInviteToken";

function generateToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  for (let i = 0; i < 16; i++) {
    token += chars[bytes[i]! % chars.length];
  }
  return token;
}

async function getStoredToken(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const row = await ctx.db
    .query("siteConfig")
    .withIndex("by_key", (q) => q.eq("key", INVITE_KEY))
    .first();
  return row?.value ?? null;
}

/** Master only: get or create the invite token. Used when generating invite links. */
export const getOrCreate = mutation({
  args: {},
  handler: async (ctx) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can get invite token");
    let token = await getStoredToken(ctx);
    if (!token) {
      token = generateToken();
      await ctx.db.insert("siteConfig", { key: INVITE_KEY, value: token });
    }
    return token;
  },
});

/** Verify an invite token. Public - no auth. Returns true if valid. */
export const verify = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const stored = await getStoredToken(ctx);
    if (!stored) return false;
    return args.token.trim() === stored;
  },
});

/** Claim admin role using a valid invite token. Call after signup with invite link - no User ID needed. */
export const claimRoleWithInvite = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Must be signed in to claim role");
    const stored = await getStoredToken(ctx);
    if (!stored || args.token.trim() !== stored) {
      throw new Error("Invalid or expired invite link");
    }
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return; // already has a role
    await ctx.db.insert("userRoles", { userId: String(userId), role: "admin" });
  },
});
