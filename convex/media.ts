import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireMaster } from "./roles";

/** Public: list media by label (hero, gallery, ceremony, reception). Site uses this for images. */
export const listByLabel = query({
  args: { label: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("media")
      .withIndex("by_label", (q) => q.eq("label", args.label))
      .order("asc")
      .collect();
  },
});

/** Public: list image URLs by label (for the live site). Returns URLs in order. */
export const listUrlsByLabel = query({
  args: { label: v.string() },
  handler: async (ctx, args) => {
    const list = await ctx.db
      .query("media")
      .withIndex("by_label", (q) => q.eq("label", args.label))
      .order("asc")
      .collect();
    const urls = await Promise.all(list.map((m) => ctx.storage.getUrl(m.storageId)));
    return urls.filter((u): u is string => u !== null);
  },
});

/** Public: get URL for a storage id (for showing images). */
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/** Master only: generate upload URL for adding a photo. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can upload");
    return await ctx.storage.generateUploadUrl();
  },
});

/** Master only: save a new photo (after client uploaded to storage). */
export const save = mutation({
  args: {
    storageId: v.id("_storage"),
    label: v.string(),
    order: v.number(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can add media");
    await ctx.db.insert("media", {
      storageId: args.storageId,
      label: args.label,
      order: args.order,
      caption: args.caption,
    });
  },
});

/** Master only: update caption or order. */
export const update = mutation({
  args: {
    id: v.id("media"),
    order: v.optional(v.number()),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can update media");
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
  },
});

/** Master only: remove a photo. */
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can remove media");
    const doc = await ctx.db.get(args.id);
    if (doc) {
      await ctx.storage.delete(doc.storageId);
      await ctx.db.delete(args.id);
    }
  },
});
