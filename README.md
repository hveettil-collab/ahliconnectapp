# Ahli Connect — IHC Employee Platform

A premium enterprise web app for IHC Group employees.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to /landing.

## Demo Flow

1. `/landing` → Welcome screen → click **Get Started**
2. `/signup` → Select company + email + password → submit
3. `/verify` → Enter any 6 digits → watch verification animation
4. `/login` → Use a demo account (click to prefill) → sign in
5. `/dashboard` → Personalized dashboard with announcements, offers, market widget
6. `/announcements` → Tabbed IHC + company announcements
7. `/offers` → Employee benefits catalog
8. `/marketplace` → Listings + click **"Post with AI"** to try the AI assistant
9. `/services` → HR shortcuts, click any to open bottom sheet
10. `/chat` → Colleague messaging
11. `/profile` → Employee profile + logout bottom sheet

## Demo Accounts

| Email | Company |
|---|---|
| sara.ahmed@shory.ae | Shory |
| khalid.mansouri@aldar.ae | Aldar Properties |
| noura.hassan@purehealth.ae | PureHealth |

Password: any value works

## Route Map

```
/landing       → Welcome / landing page
/signup        → Account creation
/verify        → OTP verification
/login         → Sign in
/dashboard     → Home dashboard (personalized by company)
/announcements → IHC & company announcements
/offers        → Employee benefit offers
/marketplace   → Internal listings + AI listing assistant
/services      → HR service shortcuts
/chat          → Colleague messaging
/profile       → Employee profile + settings
```

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React icons
- No backend — mock data in /lib/mockData.ts
- Auth state in localStorage via React Context

## GitHub + Vercel

```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR/ahli-connect.git
git push -u origin main
```

Then import repo in Vercel → Deploy. No env vars needed.

## What's Mocked
- Auth (localStorage, no real backend)
- OTP (any 6 digits work)
- Market data (static)
- All content (announcements, offers, listings)
- Chat messages (with mock auto-reply)
- Service requests (UI only)
