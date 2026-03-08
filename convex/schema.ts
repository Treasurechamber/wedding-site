import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  rsvps: defineTable({
    full_name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    attending: v.boolean(),
    guest_count: v.number(),
    plus_one_name: v.optional(v.string()),
    message: v.optional(v.string()),
  }),
  // admin = view RSVPs/messages; master = full site edit, photos, accounts
  userRoles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("master")),
  }).index("by_user", ["userId"]),
  // single doc: key "default", value = JSON string of wedding config
  siteConfig: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
  // photos: hero, gallery, ceremony, reception (storageId from Convex file storage)
  media: defineTable({
    storageId: v.id("_storage"),
    label: v.string(), // "hero" | "gallery" | "ceremony" | "reception"
    order: v.number(),
    caption: v.optional(v.string()),
  }).index("by_label", ["label"]),
});

export default schema;
