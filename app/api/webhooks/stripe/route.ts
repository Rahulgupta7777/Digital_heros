import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendSubscriptionReceipt } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (!userId) {
        console.error('No user_id in session metadata');
        return NextResponse.json({ received: true });
      }

      try {
        // Get subscription from Stripe
        if (!session.subscription) {
          console.error('No subscription ID in session');
          return NextResponse.json({ received: true });
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as unknown as Stripe.Subscription;

        const amount = (stripeSubscription.items.data[0]?.price.unit_amount || 0) / 100;

        // Upsert subscription
        const sub = stripeSubscription as unknown as Record<string, unknown>;
        const { error: subError } = await admin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan: plan || 'monthly',
            status: 'active',
            amount,
            current_period_start: new Date((sub.current_period_start as number) * 1000),
            current_period_end: new Date((sub.current_period_end as number) * 1000),
          });

        if (subError) {
          console.error('Error upserting subscription:', subError);
          return NextResponse.json({ received: true });
        }

        // Get profile for charity info
        const { data: profile } = await admin
          .from('profiles')
          .select('selected_charity_id, charity_percentage')
          .eq('id', userId)
          .single();

        if (profile?.selected_charity_id) {
          const charityAmount = (amount * (profile.charity_percentage || 10)) / 100;

          // Create charity contribution record
          await admin.from('charity_contributions').insert({
            user_id: userId,
            charity_id: profile.selected_charity_id,
            subscription_id: session.subscription as string,
            amount: charityAmount,
            percentage: profile.charity_percentage || 10,
          });
        }

        // Send receipt email
        await sendSubscriptionReceipt(userId, amount);
      } catch (err: unknown) {
        console.error('Error processing checkout.session.completed:', err);
      }
    }

    // Handle customer.subscription.updated
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const sub = subscription as unknown as Record<string, unknown>;
      const { error } = await admin
        .from('subscriptions')
        .update({
          status: subscription.status as string,
          current_period_start: new Date((sub.current_period_start as number) * 1000),
          current_period_end: new Date((sub.current_period_end as number) * 1000),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        console.error('Error updating subscription:', error);
      }
    }

    // Handle customer.subscription.deleted
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const { error } = await admin
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        console.error('Error canceling subscription:', error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
