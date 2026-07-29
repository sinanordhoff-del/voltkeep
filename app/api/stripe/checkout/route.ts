import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// POST /api/stripe/checkout — creates a Stripe Checkout session for the chosen plan
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { plan } = await req.json(); // 'solo' | 'team'
  const priceId =
    plan === 'team'
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=cancelled`,
    metadata: { supabase_user_id: user.id, plan },
  });

  return NextResponse.json({ url: session.url });
}
