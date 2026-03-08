import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { createAccount } from "@convex-dev/auth/server";
import { auth } from "./auth";
import { v } from "convex/values";

/** Master only: create a new user with email+password and assign role. */
export const createUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("master")),
  },
  handler: async (ctx, args) => {
    const masterUserId = await auth.getUserId(ctx);
    if (!masterUserId) throw new Error("Must be signed in");
    const myRole = await ctx.runQuery(api.roles.myRole);
    if (myRole !== "master") throw new Error("Only masters can create users");

    const emailNorm = args.email.trim().toLowerCase();
    if (!emailNorm) throw new Error("Email is required");
    if (args.password.length < 8) throw new Error("Password must be at least 8 characters");

    const { user } = await createAccount(ctx, {
      provider: "password",
      account: { id: emailNorm, secret: args.password },
      profile: { email: emailNorm },
    });

    await ctx.runMutation(api.roles.setRole, {
      userId: String(user._id),
      role: args.role,
    });

    return { userId: String(user._id), email: emailNorm };
  },
});
