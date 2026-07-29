import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// This endpoint is called directly by Stripe's servers, not by your app's users.
// Configure this URL in the Stripe dashboard: Developers > Webhooks > Add endpoint
// URL: https://your-app.vercel.app/api/stripe/webhook
// Events to send: checkout.session.completed, customer.subscription.deleted
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    const plan = session.metadata?.plan || 'solo';

    if (userId) {
      await supabase
        .from('businesses')
        .update({
          plan,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('owner_id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await supabase
      .from('businesses')
      .update({ plan: 'trial' })
      .eq('stripe_subscription_id', subscription.id);
  }

  return NextResponse.json({ received: true });
}
