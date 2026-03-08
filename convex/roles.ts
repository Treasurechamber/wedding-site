import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { auth } from "./auth";

type AnyCtx = QueryCtx | MutationCtx;

/** Current user's Convex auth id (for sharing with master to get a role). */
export const currentUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    return userId ?? null;
  },
});

/** Get current user's role (admin or master). Returns null if not logged in or no role. */
export const myRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    const row = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return row?.role ?? null;
  },
});

/** Require admin (or master). Use in queries/mutations for admin dashboard. */
export async function requireAdmin(ctx: AnyCtx) {
  const userId = await auth.getUserId(ctx as Parameters<typeof auth.getUserId>[0]);
  if (!userId) return null;
  const row = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  if (row?.role === "admin" || row?.role === "master") return { userId, role: row.role };
  return null;
}

/** Require master. Use in mutations for master-only actions. */
export async function requireMaster(ctx: AnyCtx) {
  const userId = await auth.getUserId(ctx as Parameters<typeof auth.getUserId>[0]);
  if (!userId) return null;
  const row = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  if (row?.role === "master") return { userId, role: "master" as const };
  return null;
}

/** List all users with roles (master only). */
export const listWithRoles = query({
  args: {},
  handler: async (ctx) => {
    const me = await requireMaster(ctx);
    if (!me) return [];
    const rows = await ctx.db.query("userRoles").collect();
    return rows;
  },
});

/** List users with roles and emails (master only). */
export const listWithEmails = query({
  args: {},
  handler: async (ctx) => {
    const me = await requireMaster(ctx);
    if (!me) return [];
    const rows = await ctx.db.query("userRoles").collect();
    return Promise.all(
      rows.map(async (r) => {
        const user = await ctx.db.get(r.userId as Id<"users">);
        return { ...r, email: user?.email ?? null };
      })
    );
  },
});

/** Set role for a user (master only). userId is the Convex auth user id (string). */
export const setRole = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("master")),
  },
  handler: async (ctx, args) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can set roles");
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
    } else {
      await ctx.db.insert("userRoles", { userId: args.userId, role: args.role });
    }
  },
});

/** Remove a user's role (master only). Cannot remove the last Master. */
export const removeRole = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const me = await requireMaster(ctx);
    if (!me) throw new Error("Only masters can remove roles");
    const row = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (!row) return;
    if (row.role === "master") {
      const masters = await ctx.db
        .query("userRoles")
        .filter((q) => q.eq(q.field("role"), "master"))
        .collect();
      if (masters.length <= 1) {
        throw new Error("Cannot remove the last Master. Grant Master to someone else first.");
      }
    }
    await ctx.db.delete(row._id);
  },
});

/** Whether any master exists (for showing "Claim master" vs "Ask for access"). */
export const hasMaster = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("userRoles")
      .filter((q) => q.eq(q.field("role"), "master"))
      .first();
    return !!row;
  },
});

/** Claim master: first user to call this becomes master. After that only masters can assign. */
export const claimMaster = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Must be signed in to claim master");
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return; // already has a role
    const anyMaster = await ctx.db
      .query("userRoles")
      .filter((q) => q.eq(q.field("role"), "master"))
      .first();
    if (anyMaster) throw new Error("A master already exists. Ask them to grant you a role.");
    await ctx.db.insert("userRoles", { userId: String(userId), role: "master" });
  },
});
