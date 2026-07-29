# VoltKeep — Deployment Guide

This is the real, working codebase for VoltKeep: auth, a database, credential tracking, automated reminder emails, and Stripe billing. It's not deployed yet — that requires you to create a few free/low-cost accounts and connect them. Follow these steps in order.

## What you'll need to create (all take a few minutes each)

1. A **GitHub** account (to hold the code) — github.com
2. A **Supabase** account (free tier is fine to start) — supabase.com
3. A **Vercel** account (free tier is fine to start) — vercel.com
4. A **Stripe** account (free, only takes a cut of real transactions) — stripe.com
5. A **Resend** account (free tier: 3,000 emails/month) — resend.com

## Step 1 — Get the code onto GitHub

1. Create a new, empty repository on GitHub (no README, no .gitignore — just empty)
2. In a terminal, inside this project folder:
   ```
   git init
   git add .
   git commit -m "Initial VoltKeep build"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/voltkeep.git
   git push -u origin main
   ```

## Step 2 — Set up Supabase (your database + auth)

1. Create a new project at supabase.com
2. Once it's created, go to **SQL Editor > New query**, paste in the entire contents of `supabase/schema.sql`, and run it. This creates all the tables and security rules.
3. Go to **Project Settings > API** — copy the **Project URL** and the **anon public key** and the **service_role key**. You'll paste these into your `.env.local` in Step 4.
4. Go to **Authentication > Providers** — make sure **Email** is enabled (it is by default). This is what powers the passwordless login link.
5. (Optional, for document uploads) Go to **Storage**, create a new bucket called `credential-documents`, and set it to private.

## Step 3 — Set up Stripe (billing)

1. In the Stripe dashboard, go to **Product catalog** and create two products:
   - "VoltKeep Solo" — $29/month recurring
   - "VoltKeep Team" — $59/month recurring
2. Copy each product's **Price ID** (starts with `price_...`) — you'll need these for `.env.local`.
3. Go to **Developers > API keys** — copy your **Secret key**.
4. You'll set up the webhook (Developers > Webhooks) **after** your first deploy in Step 5, once you have a real URL to point it at.

## Step 4 — Set up Resend (reminder emails)

1. Create an account, verify a sending domain (or use their test domain to start)
2. Go to **API Keys** and create one — copy it

## Step 5 — Fill in your environment variables

1. Copy `.env.example` to a new file called `.env.local`
2. Fill in every value using what you copied from Supabase, Stripe, and Resend in the steps above
3. For `CRON_SECRET`, just make up a long random string yourself (e.g. generate one at random.org) — this protects your reminder-email endpoint from being triggered by strangers

## Step 6 — Deploy to Vercel

1. Go to vercel.com, click **Add New Project**, and import the GitHub repo you pushed in Step 1
2. When it asks for environment variables, paste in everything from your `.env.local`
3. Click Deploy — in about a minute you'll have a real, public URL like `voltkeep.vercel.app`
4. Go back into your Vercel project's environment variables and update `NEXT_PUBLIC_APP_URL` to that real URL, then redeploy (Vercel will prompt you)

## Step 7 — Connect the Stripe webhook

1. Now that you have a real deployed URL, go to Stripe **Developers > Webhooks > Add endpoint**
2. URL: `https://your-app.vercel.app/api/stripe/webhook`
3. Events to send: `checkout.session.completed` and `customer.subscription.deleted`
4. Copy the **Signing secret** it gives you, add it as `STRIPE_WEBHOOK_SECRET` in Vercel's environment variables, and redeploy

## Step 8 — Confirm the daily reminder job is running

Vercel will automatically call `/api/cron/send-reminders` once a day based on `vercel.json` (currently set to 1pm UTC — edit that file if you want a different time). You can also trigger it manually to test:
```
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-app.vercel.app/api/cron/send-reminders
```

## Step 9 — Buy a real domain (optional but recommended before selling to real customers)

Buy a domain (Namecheap, Google Domains, etc.), then in Vercel go to **Project Settings > Domains** and add it — Vercel walks you through the DNS setup.

## What's intentionally NOT built yet (per the MVP scope in the plan)

- Document upload UI (the database and storage bucket are ready for it, but the upload form isn't wired up yet)
- Team member management UI (the `team_members` table exists; there's no page to add people yet — for now this can be done directly in the Supabase table editor)
- Multi-location dashboards (the schema supports one business per owner; multi-location would need a small schema extension)

These are the natural "add once you have paying customers asking for them" features, per the plan's philosophy of shipping the smallest useful version first.
