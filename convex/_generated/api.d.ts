/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as coupleAuth from "../coupleAuth.js";
import type * as http from "../http.js";
import type * as inviteToken from "../inviteToken.js";
import type * as masterUsers from "../masterUsers.js";
import type * as media from "../media.js";
import type * as roles from "../roles.js";
import type * as rsvps from "../rsvps.js";
import type * as siteConfig from "../siteConfig.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  coupleAuth: typeof coupleAuth;
  http: typeof http;
  inviteToken: typeof inviteToken;
  masterUsers: typeof masterUsers;
  media: typeof media;
  roles: typeof roles;
  rsvps: typeof rsvps;
  siteConfig: typeof siteConfig;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
