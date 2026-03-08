# 💍 Sophia & Alexander's Wedding Invitation Website

A stunning, modern, and classy wedding invitation website with an elegant envelope opening animation, interactive sections, and a hidden admin dashboard. **Backend powered by Convex.**

## ✨ Features

- **Envelope Opening Animation** - Magical first impression with a realistic envelope and wax seal
- **Hero Section** - Full-screen image slider with couple names and wedding date
- **Countdown Timer** - Live countdown to the big day
- **Venue & Map** - Ceremony and reception details with embedded Google Maps
- **Event Schedule** - Beautiful timeline of the day's events
- **RSVP Form** - Comprehensive form with Convex backend
- **Hidden Admin Dashboard** - Secret access via triple-click on initials or `Ctrl+Shift+A`
- **Love Story** - Timeline of your relationship
- **Gallery** - Photo gallery with lightbox
- **Travel & Accommodations** - Hotel block information
- **Registry** - Gift registry links
- **FAQs** - Accordion-style common questions

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Convex

1. Run the Convex dev server (creates project and config):

```bash
npx convex dev
```

2. Log in with GitHub when prompted
3. This creates `convex/` folder and adds `NEXT_PUBLIC_CONVEX_URL` to `.env.local`

### 3. Set Up Convex Auth (for Admin Dashboard)

1. Install jose for key generation: `npm install jose`
2. Run `npx @convex-dev/auth` to initialize auth, or manually:
   - Generate JWT keys using the script at [Convex Auth Setup](https://labs.convex.dev/auth/setup/manual)
   - Add `JWT_PRIVATE_KEY` and `JWKS` to Convex Dashboard → Settings → Environment Variables
3. **Optional**: Set `SITE_URL` for OAuth (e.g. `http://localhost:3000` for local dev)

### 4. Run (Easy — One Command)

```bash
npm run dev:all
```

This starts both Convex and the Next.js server. Then open:

**http://localhost:3000/launch**

Click any button to open that section in a **new window** (Site, Admin, Master stay in separate windows).

---

*Alternatively*, run in two terminals:
- Terminal 1: `npx convex dev`
- Terminal 2: `npm run dev`

## 📸 Adding Wedding Photos

1. Add your images to `public/images/`:
   - `hero-1.jpg` through `hero-5.jpg` - Hero slider images (recommended: 1920x1080)
   - `ceremony.jpg` - Ceremony venue photo
   - `reception.jpg` - Reception venue photo
   - Gallery images - Update `src/components/Gallery.tsx` to use your image paths

2. Update `src/lib/wedding-config.ts` if you use different filenames

## 🎨 Customization

### Colors & Theme
Edit `src/app/globals.css` and component files. The default theme uses:
- **Gold**: #D4AF37
- **Ivory**: #FFFEF7
- **Navy**: #0f1729

### Wedding Details
Edit `src/lib/wedding-config.ts` to update:
- Couple names and initials
- Wedding date and time
- Venue addresses and map URLs
- Event schedule
- Love story
- Accommodations
- Registry links
- FAQs

### Fonts
The site uses Great Vibes (script) and Cormorant Garamond (serif). Change in `src/app/layout.tsx`.

## 🔐 Admin Dashboard Access

**Three ways to access:**

1. **Triple-click** on the couple's initials (S&A) in the footer
2. **Keyboard shortcut**: `Ctrl+Shift+A` (Windows) or `Cmd+Shift+A` (Mac)
3. Sign in with your Convex Auth account when the dashboard opens

### Setting Up Admin User

1. Open the admin dashboard (triple-click initials or `Ctrl+Shift+A`)
2. Click "First time? Create an account"
3. Enter your email and password to sign up
4. Sign in with those credentials to view RSVPs

## 📤 Put Your Site Online

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step instructions to deploy to Vercel and Convex Cloud.

## 🗺️ Google Maps

To use real venue maps:
1. Go to [Google Maps](https://maps.google.com)
2. Search for your venue
3. Click Share > Embed a map
4. Copy the iframe src URL
5. Paste into `wedding-config.ts` for `mapUrl` and `directionsUrl`

## 📋 Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- **Convex** (Database + Auth)
- Convex Auth (Password provider)
- React Hook Form + Zod
- Lucide React Icons
- Canvas Confetti

## 🐛 Troubleshooting

**RSVP form not submitting?**
- Ensure `npx convex dev` is running
- Verify `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`

**Admin dashboard not loading RSVPs?**
- Create an account first (Sign up flow)
- Ensure JWT keys are set in Convex dashboard
- Check browser console for auth errors

**Convex Auth errors?**
- Verify `JWT_PRIVATE_KEY` and `JWKS` are set in Convex environment variables
- Run `npx @convex-dev/auth` if you need to re-run the auth setup

**Envelope not opening?**
- Ensure JavaScript is enabled
- Try a hard refresh (Ctrl+Shift+R)

## 📄 License

Private - For personal wedding use.
