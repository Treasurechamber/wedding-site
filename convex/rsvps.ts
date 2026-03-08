import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./roles";
import { isValidCoupleId } from "./coupleAuth";

export const create = mutation({
  args: {
    full_name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    attending: v.boolean(),
    guest_count: v.number(),
    plus_one_name: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("rsvps", args);
  },
});

/** List RSVPs — requires valid Couple ID or Convex Auth (admin/master). */
export const list = query({
  args: { coupleId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.coupleId && (await isValidCoupleId(ctx, args.coupleId))) {
      return await ctx.db.query("rsvps").order("desc").collect();
    }
    const admin = await requireAdmin(ctx);
    if (admin) {
      return await ctx.db.query("rsvps").order("desc").collect();
    }
    return [];
  },
});
