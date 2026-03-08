# Put Your Wedding Site Online

Follow these steps to deploy your site so it's accessible from anywhere.

---

## Prerequisites

- **GitHub account** (free at github.com)
- **Vercel account** (free at vercel.com)
- **Convex account** (created when you run `npx convex login`)

---

## Step 1: Push Your Code to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. In your project folder, run:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

---

## Step 2: Log In to Convex & Create Production Deployment

1. **Log in to Convex** (creates your account):

```powershell
npx convex login
```

Follow the prompts (sign in with GitHub or email).

2. **Link your project** (if prompted, select or create a team):

```powershell
npx convex dev
```

Press Ctrl+C to stop after it connects. You just need to link the project once.

3. **Deploy Convex to the cloud**:

```powershell
npx convex deploy
```

This creates your **production** Convex backend in the cloud. You'll get a URL like `https://xxx.convex.cloud`.

---

## Step 3: Set Auth Keys for Production

Your production Convex deployment needs JWT keys for sign-in.

1. **Generate and print keys**:

```powershell
npm run auth:keys:print
```

Copy the two values it prints (`JWT_PRIVATE_KEY` and `JWKS`).

2. In the [Convex Dashboard](https://dashboard.convex.dev):
   - Open your project
   - Go to **Settings** → **Environment Variables**
   - Switch to the **Production** deployment (dropdown at top)
   - Add variable `JWT_PRIVATE_KEY` — paste the long string (starts with `-----BEGIN PRIVATE KEY-----`)
   - Add variable `JWKS` — paste the JSON (starts with `{"keys":[...]}`)

---

## Step 4: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import** your GitHub repository
3. Click **Deploy** (Vercel will auto-detect Next.js)
4. **Before it finishes**, go to **Settings** → **Environment Variables** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `CONVEX_DEPLOY_KEY` | (from Convex Dashboard, see below) | Production |

**Get `CONVEX_DEPLOY_KEY`:**
- Open [dashboard.convex.dev](https://dashboard.convex.dev)
- Select your project
- Go to **Settings** → **Deployment** (or **General**)
- Click **Generate Production Deploy Key**
- Copy the key and paste it into Vercel

5. **Override the Build Command** (Vercel → Settings → Build & Development):
   - Build Command: `npx convex deploy --cmd "npm run build"`

6. **Redeploy** (Deployments → ⋮ on latest → Redeploy)

---

## Step 5: Configure Convex Auth for Your Live URL

After your first Vercel deploy, you'll get a URL like `https://your-project.vercel.app`.

1. In [Convex Dashboard](https://dashboard.convex.dev) → **Settings** → **Environment Variables**
2. Select **Production** deployment
3. Add:
   - `SITE_URL` = `https://your-project.vercel.app` (or your custom domain)

---

## Step 6: Claim Master on Production

1. Open `https://your-project.vercel.app/master`
2. Create an account (email + password)
3. Click **Claim Master**
4. You're done!

---

## Your Site Is Now Live

| URL | Purpose |
|-----|---------|
| `https://your-project.vercel.app` | Wedding site (public) |
| `https://your-project.vercel.app/master` | Master panel (edit site) |
| `https://your-project.vercel.app/admin` | Admin (view guests) |
| `https://your-project.vercel.app/launch` | Launcher (open all in new windows) |

---

## Optional: Custom Domain

In Vercel → **Settings** → **Domains**, add your own domain (e.g. `wedding.yourname.com`). Then update `SITE_URL` in Convex to match.

---

## Troubleshooting

**"pkcs8" or sign-in fails in production**  
→ JWT keys (`JWT_PRIVATE_KEY`, `JWKS`) must be set in Convex Dashboard for the **Production** deployment.

**Site loads but data doesn't**  
→ Check that `CONVEX_DEPLOY_KEY` is set in Vercel and the build uses `npx convex deploy --cmd "npm run build"`.

**Changes not showing**  
→ Push to GitHub; Vercel auto-deploys. Convex functions deploy during the build.
