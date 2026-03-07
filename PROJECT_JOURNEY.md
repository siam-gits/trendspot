# TrendSpot Store: The Complete Developer Journey 🚀

Welcome! This document outlines everything we did side-by-side to build **TrendSpot Store** from scratch. It is written specifically for an entry-level junior full-stack developer to easily understand the architecture, the decisions made, and how all the tools fit together.

---

## 1. Initial Setup: The Foundation 🏗️

We started the project by initializing a shiny new Next.js 15 application using the App Router. Next.js is a React framework that gives us server-side rendering (SSR), static site generation (SSG), and easy API routes out-of-the-box.

**What we ran:**
```bash
npx create-next-app@latest trendspotstore
```

**Settings we chose:**
- **TypeScript:** Yes (Provides strict typing to catch errors before runtime).
- **Tailwind CSS:** Yes (Utility-first CSS framework for rapid UI styling).
- **App Router:** Yes (The modern mental model for routing in Next.js).
- **ESLint:** Yes (A linter to enforce code quality).

---

## 2. Installing Core Dependencies 📦

To build a modern e-commerce site, we brought in several powerful libraries:

### User Interface & Styling
- **shadcn/ui** (`npx shadcn@latest init`): Instead of a bloated component library, shadcn provides beautifully designed components that we actually copy-paste into our local `components/ui` folder. It uses `radix-ui` under the hood for accessibility.
- **lucide-react**: Clean, customizable SVG icons.
- **framer-motion**: Used to add butter-smooth, professional animations (like the bouncy hero text and sliding cart).
- **next-themes**: Allowed us to easily add a Dark Mode / Light Mode toggle.

### State Management
- **zustand**: This is how we handle our Shopping Cart. Zustand is a small, fast, and scalable bear-bones state-management solution. We chose it over Redux because it's significantly easier to set up and requires zero boilerplate. We configured it to use `localStorage` to persist the user's cart even if they refresh the page.

### Database & Authentication
- **mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and translates between objects in code and the representation of those objects in MongoDB.
- **bcryptjs**: Used to securely hash and salt user passwords before saving them in the database.
- **next-auth (Auth.js v5)**: The industry standard for handling authentication in Next.js. We implemented both **Google OAuth** (social login) and custom **Email/Password Credentials** logic.

### Payments
- **stripe** & **@stripe/stripe-js**: The backend SDK and frontend library to create secure, hosted Checkout Sessions in Stripe's test mode.

---

## 3. Database Architecture (MongoDB Atlas) 🗄️

We set up a free cluster on MongoDB Atlas and connected it to our Next.js backend using a singleton connection helper (`lib/db.ts`). This ensures we don't open thousands of connections in serverless environments.

**Key Models Built:**
1. **User Model (`models/User.ts`)**: Stores the user's name, email, hashed password, and an array of `favorites` (saved product IDs).
2. **Order Model (`models/Order.ts`)**: Records completed Stripe checkout sessions including the products bought, total amount, and stripe session ID.

---

## 4. The Frontend: Pages & Components 🎨

### `app/page.tsx` (The Homepage)
- We built a dynamic, welcoming hero section (`components/HomeHero.tsx` & `components/HeroAnimation.tsx`) tailored with framer-motion.
- We fetched the products dynamically from `dummyjson.com` (a free mock API) instead of bloating our own database with fake products.

### `app/products/[id]/page.tsx` (Dynamic Routing)
- This is a dynamic route. The `[id]` folder tells Next.js to match any URL like `/products/1` or `/products/12`.
- Inside, we fetch the specific product details concurrently.

### The Cart System (`components/CartSheet.tsx` & `store/cartStore.ts`)
- The Cart sits in a slide-out drawer accessible from anywhere (using shadcn's `Sheet` component).
- `CartInitializer.tsx` helps hydrate the Zustand state only on the client-side to prevent annoying Hydration Mismatches in React.

---

## 5. Security & Authentication (Auth.js) 🔐

Authentication is configured heavily inside `auth.ts` at the root of the project.

**How user login works:**
1. When a user registers, we hash their password using `bcryptjs` and save it to MongoDB.
2. During Sign-In, `next-auth` intercepts the request, verifies the password, and creates a secure HTTP-Only cookie.
3. This creates a secure JWT (JSON Web Token) session.
4. If a user logs in via Google, `next-auth` handles the OAuth handshake and automatically links/creates the user account in our DB.

> **Junior Dev Tip:** We use Server Actions (`actions/auth.ts`) to securely keep login/registration logic entirely on the server.

---

## 6. Payment Processing (Stripe) 💳

We integrated Stripe Checkout purely in **Test Mode**.
1. When a user clicks "Checkout", the Next.js frontend calls the server action `checkout.ts`.
2. The server action iterates over the user's cart and formats the items into "Line Items", which is what Stripe expects.
3. We securely contact the Stripe API using our Secret Key.
4. Stripe returns an encrypted `Session URL`.
5. We redirect the user directly to the Stripe-hosted payment page.

After a successful test payment, they are redirected back to our customized `/success` page.

---

## 7. The Power of Server Actions ⚡

A major milestone in this project was using **Next.js Server Actions** (`actions/`).
Traditionally, you would need to create a dedicated API route (`/api/cart`), write a `fetch()` request on the frontend, stringify data, parse JSON, and handle API errors.

Instead, Server Actions allow us to define asynchronous functions on the server (using `"use server"`) and call them *directly* from our React Client Components (like a button click). We used this for:
- Logging in and out.
- Toggling Favorites.
- Instantiating Stripe checkouts.

---

## 8. Final Deployment (Vercel) 🚀

Finally, we deployed the entire project to Vercel (the creators of Next.js).
1. We connected the GitHub repository.
2. We secured our environment variables (MongoDB URI, Google Client ID, Stripe Keys, NextAuth Secret) inside Vercel's settings dashboard.
3. We provided a stable Vercel deployment URL back into GitHub's `README.md`.

---

## 🎉 Summary

We successfully took an empty command line terminal and layered modern, bleeding-edge functional paradigms on top of it. You now have a complete, secure, full-stack application relying on industry-standard platforms (Vercel, MongoDB, Auth.js, Stripe, Tailwind) utilizing React's most modern features (Server Components & Server Actions).

*Keep this document as a quick reference point whenever you feel lost in the codebase!*
