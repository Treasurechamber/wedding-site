import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireMaster } from "./roles";

const CONFIG_KEY = "default";

/** Public: get wedding site config (JSON string). Site uses this with fallback to static config. */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first();
    return row?.value ?? null;
  },
});

/** Master only: set full site config. value = JSON.stringify(weddingConfig). */
export const set = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can update site config");
    const existing = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("siteConfig", { key: CONFIG_KEY, value: args.value });
    }
  },
});
