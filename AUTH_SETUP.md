# Auth Setup (JWT Keys)

If you see **"pkcs8 must be PKCS#8 formatted string"** when signing in, Convex Auth needs JWT signing keys.

## Fix

1. **Generate keys:**
   ```bash
   npm run auth:keys
   ```

2. **Copy the two commands** it prints (they set `JWT_PRIVATE_KEY` and `JWKS`).

3. **Run those commands** in your project folder (with Convex dev stopped, or in a new terminal):
   ```bash
   npx convex env set JWT_PRIVATE_KEY "-----BEGIN PRIVATE KEY----- ..."
   npx convex env set JWKS '{"keys":[...]}'
   ```

4. **Restart Convex:**
   ```bash
   npx convex dev
   ```

5. Try **Create account** or **Sign in** again.
