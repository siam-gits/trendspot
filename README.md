# TrendSpot Store 🛍️

> **Portfolio Demo Project** — A modern, full-stack e-commerce demo showcasing real-world Next.js development skills.

🟢 **Live Demo:** [TrendSpot Store on Vercel](https://trendspotstore.vercel.app/) *(Check deployment status via Vercel)*

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com/)

---

## ⚠️ Important Disclaimers

- **This is a PORTFOLIO DEMO project**, not a production marketplace.
- All products are mock data from [dummyjson.com](https://dummyjson.com) — no real products.
- **Stripe is in TEST MODE only** — no real payments are processed.
- Test card: `4242 4242 4242 4242` | Expiry: any future date | CVC: any 3 digits

---

## 🎯 Features

| Feature | Tech |
|---|---|
| Modern UI | Next.js 15 App Router + Tailwind v4 + shadcn/ui |
| Authentication | Auth.js v5 (JWT strategy) |
| Google OAuth | Sign in with Google |
| Registration | Email/password with bcrypt hashing |
| Cart | Zustand + localStorage persistence |
| Favorites | MongoDB Atlas (user's saved product IDs) |
| Checkout | Stripe Checkout Session (Test mode) |
| Products | dummyjson.com mock API |
| Animations | Framer Motion (subtle) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB Atlas account (free tier)
- Stripe account (free, test mode)
- Google Cloud Console project (for OAuth)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd trendspotstore
npm install
```

### 2. Configure Environment Variables

Copy the `.env.local` file and fill in your values:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/trendspotstore?retryWrites=true&w=majority

AUTH_SECRET=<generate with: openssl rand -base64 32>

GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx

NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Setup Guides

### MongoDB Atlas

1. Go to [mongodb.com/atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Add a database user with read/write permissions
4. Whitelist IP `0.0.0.0/0` (for development, restrict in production)
5. Get your connection string from **Connect > Drivers**

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google+ API** or **People API**
4. Go to **Credentials > Create OAuth Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Secret to `.env.local`

### Stripe (Test Mode)

1. Go to [stripe.com](https://stripe.com) and create an account
2. In the dashboard, ensure **Test mode** is toggled on
3. Go to **Developers > API keys**
4. Copy **Publishable key** and **Secret key** to `.env.local`

---

## 📦 Project Structure

```
/app
  /api/auth/[...nextauth]  # Auth.js handler
  /api/register            # Registration endpoint
  /products                # Products listing + [id] detail
  /sign-in                 # Login page
  /register                # Registration page
  /favorites               # Protected favorites page
  /success                 # Stripe success page
  layout.tsx               # Root layout

/components
  Header.tsx               # Sticky nav with cart badge
  CartSheet.tsx            # Slide-out cart drawer
  ProductCard.tsx          # Reusable product card
  SkeletonCard.tsx         # Loading skeleton
  Providers.tsx            # SessionProvider + Toaster

/lib
  api.ts                   # dummyjson.com fetch helpers
  db.ts                    # MongoDB connection

/models
  User.ts                  # Mongoose user schema

/store
  cartStore.ts             # Zustand cart with localStorage

/actions
  checkout.ts              # Stripe checkout server action
  favorites.ts             # Favorites toggle server action

auth.ts                    # Auth.js v5 config
```

---

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import repository
3. Add all environment variables from `.env.local`
4. Update `NEXTAUTH_URL` to your Vercel deployment URL
5. Update Google OAuth redirect URIs to include your Vercel URL
6. Deploy!

---

## 🧪 Test the Checkout

1. Add any products to cart
2. Click **Checkout with Stripe**
3. Use test card: `4242 4242 4242 4242`
4. Any future expiry + any CVC
5. You'll be redirected to `/success`

---

## 📝 License

MIT — Feel free to use this as a portfolio project template.
