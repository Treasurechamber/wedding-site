#!/usr/bin/env node
/**
 * Generate and PRINT JWT keys for Convex Auth production.
 * Copy the output and add to Convex Dashboard → Settings → Environment Variables (Production).
 */
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });
const privateKeyOneLine = privateKey.trimEnd().replace(/\n/g, " ");

console.log("\n=== Add these to Convex Dashboard → Settings → Environment Variables (Production) ===\n");
console.log("JWT_PRIVATE_KEY:");
console.log(privateKeyOneLine);
console.log("\nJWKS:");
console.log(jwks);
console.log("\n=== Copy each value and add as a separate variable in the dashboard ===\n");
