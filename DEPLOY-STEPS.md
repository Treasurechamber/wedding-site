# Deploy Your Wedding Site — Step by Step

Do these steps **one at a time**. Don't skip ahead.

---

## PART 1: Get Convex Online

### Step 1: Close Everything
- Close your browser tab with the wedding site (localhost:3000)
- In the terminal where `npm run dev:all` is running, press **Ctrl+C** to stop it
- Wait until it fully stops

### Step 2: Open a New Terminal
- Open PowerShell or Command Prompt
- Navigate to your project:
  ```
  cd C:\Users\TT\Desktop\n4_project
  ```

### Step 3: Log In to Convex
Type this and press Enter:
```
npx convex login
```

- A browser window or tab may open
- If it asks you to log in, use **GitHub** or your email
- Finish the login until you see "You are logged in" or similar
- If nothing opens, check the terminal — it will show a link. Copy that link, paste it in your browser, and open it

### Step 4: Create Your Convex Project (First Time Only)
Type this and press Enter:
```
npx convex dev
```

- It will ask: **"Create a new project?"** or **"Link to existing project?"**
- Choose **"Create a new project"** (or type Y)
- It may ask for a project name — you can type `wedding` or press Enter for the default
- Wait until you see **"Convex functions ready!"**
- Press **Ctrl+C** to stop it

### Step 5: Deploy Convex to the Cloud
Type this and press Enter:
```
npx convex deploy
```

- Wait until it says **"Deployed!"** or **"Production deployment is live"**
- ✅ Convex is now online

---

## PART 2: Push Code to GitHub

### Step 6: Create a GitHub Account (if you don't have one)
- Go to https://github.com
- Click **Sign up**
- Follow the steps to create an account

### Step 7: Install Git (if you don't have it)
- Go to https://git-scm.com/download/win
- Download and run the installer
- Use the default options
- Restart your terminal after installing

### Step 8: Create a New Repository on GitHub
- Go to https://github.com/new
- **Repository name:** `wedding-site` (or any name)
- Leave everything else as default
- Click **Create repository**
- **Do not** add a README or other files — leave it empty

### Step 9: Push Your Code
In your terminal (in `C:\Users\TT\Desktop\n4_project`), run these **one at a time**:

```
git init
```
Press Enter.

```
git add .
```
Press Enter.

```
git commit -m "Wedding site"
```
Press Enter.

```
git branch -M main
```
Press Enter.

```
git remote add origin https://github.com/YOUR_USERNAME/wedding-site.git
```
**Replace `YOUR_USERNAME`** with your actual GitHub username.  
**Replace `wedding-site`** with the repo name you used in Step 8.  
Press Enter.

```
git push -u origin main
```
Press Enter.
- If it asks for username/password, use your GitHub username and a **Personal Access Token** (not your normal password).  
  To create a token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token.

---

## PART 3: Deploy to Vercel

### Step 10: Create a Vercel Account
- Go to https://vercel.com
- Click **Sign Up**
- Choose **Continue with GitHub**
- Authorize Vercel to use your GitHub account

### Step 11: Import Your Project
- On Vercel, click **Add New** → **Project**
- Find **wedding-site** (or whatever you named it) in the list
- Click **Import** next to it

### Step 12: Add the Convex Deploy Key
- Before clicking **Deploy**, click **Environment Variables** (or **Configure**)
- Go to https://dashboard.convex.dev
- Open your project
- Go to **Settings** (gear icon)
- Find **Production Deploy Key** or **Deploy Key**
- Click **Generate** (or **Create**) and copy the key
- Back in Vercel, add:
  - **Name:** `CONVEX_DEPLOY_KEY`
  - **Value:** (paste the key you copied)
  - **Environment:** Production ✓
- Click **Save**

### Step 13: Change the Build Command
- In Vercel, before deploying, find **Build and Development Settings** or **Override**
- Find **Build Command**
- Replace it with:
  ```
  npx convex deploy --cmd "npm run build"
  ```
- Click **Save**

### Step 14: Deploy
- Click **Deploy**
- Wait a few minutes
- When it finishes, you'll get a link like `https://wedding-site-xxx.vercel.app`
- ✅ Your site is online

---

## PART 4: Fix Sign-In (Auth Keys)

### Step 15: Generate Auth Keys
In your terminal:
```
npm run auth:keys:print
```

- It will print two long values
- Copy the **first** one (JWT_PRIVATE_KEY) — the whole thing
- Copy the **second** one (JWKS) — the whole JSON

### Step 16: Add Keys to Convex
- Go to https://dashboard.convex.dev
- Open your project
- Go to **Settings** → **Environment Variables**
- Make sure **Production** is selected (dropdown at the top)
- Click **Add environment variable**
  - Name: `JWT_PRIVATE_KEY`
  - Value: (paste the first value from Step 15)
- Click **Add**
- Add another:
  - Name: `JWKS`
  - Value: (paste the second value from Step 15)
- Click **Add**

### Step 17: Set Your Site URL
- In the same Environment Variables page
- Add:
  - Name: `SITE_URL`
  - Value: `https://YOUR-VERCEL-URL.vercel.app`  
    (Use the actual URL Vercel gave you in Step 14)

### Step 18: Claim Master
- Open `https://YOUR-VERCEL-URL.vercel.app/master`
- Create an account (email + password)
- Click **Claim Master**
- ✅ You're done

---

## Quick Reference

| Step | What to do |
|------|------------|
| 1–5 | Convex login and deploy |
| 6–9 | Push code to GitHub |
| 10–14 | Deploy to Vercel |
| 15–18 | Auth keys + claim Master |

---

## Stuck?

Tell me **which step number** you're on and **what you see** (or what error message), and I can help.
