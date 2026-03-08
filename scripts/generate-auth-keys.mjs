#!/usr/bin/env node
/**
 * Generate JWT keys for Convex Auth and set them automatically.
 * Prerequisite: Run `npx convex dev` in another terminal first.
 * Then run: node scripts/generate-auth-keys.mjs
 */
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });
const privateKeyOneLine = privateKey.trimEnd().replace(/\n/g, " ");

const cwd = process.cwd();
const tmpKey = path.join(cwd, ".convex-auth-key.tmp");
const tmpJwks = path.join(cwd, ".convex-auth-jwks.tmp");

try {
  fs.writeFileSync(tmpKey, privateKeyOneLine);
  fs.writeFileSync(tmpJwks, jwks);

  console.log("\n=== Setting JWT keys (Convex dev must be running) ===\n");

  // Use file + pipe (works reliably on Windows)
  const pipeCmd = process.platform === "win32"
    ? `type "${tmpKey}" | npx convex env set JWT_PRIVATE_KEY`
    : `cat "${tmpKey}" | npx convex env set JWT_PRIVATE_KEY`;

  const r1 = spawnSync(pipeCmd, { stdio: "inherit", shell: true, cwd });
  if (r1.status !== 0) {
    throw new Error("JWT_PRIVATE_KEY");
  }
  console.log("JWT_PRIVATE_KEY set.");

  const pipeCmd2 = process.platform === "win32"
    ? `type "${tmpJwks}" | npx convex env set JWKS`
    : `cat "${tmpJwks}" | npx convex env set JWKS`;

  const r2 = spawnSync(pipeCmd2, { stdio: "inherit", shell: true, cwd });
  if (r2.status !== 0) {
    throw new Error("JWKS");
  }
  console.log("JWKS set.");

  console.log("\n=== Done! Restart `npx convex dev` (Ctrl+C then run again) ===\n");
} catch (e) {
  console.error(`\nFailed to set ${e.message}. Is \`npx convex dev\` running in another terminal?`);
  process.exit(1);
} finally {
  try { fs.unlinkSync(tmpKey); } catch {}
  try { fs.unlinkSync(tmpJwks); } catch {}
}
