'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export default function SubscribePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }

      // Check for active subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (sub) {
        setActiveSubscription(true);
      }
    }
    checkAuth();
  }, [supabase]);

  if (activeSubscription) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-gradient px-6">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-3xl font-display font-bold text-warm-deep">
            Already subscribed
          </h1>
          <p className="mb-8 text-warm-deep/60">
            You already have an active subscription. Go to your dashboard to manage it.
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded-full bg-warm-coral px-8 py-3 font-medium text-white hover:bg-[#FF5555] transition-all"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    );
  }

  async function handleCheckout(plan: 'monthly' | 'yearly') {
    setLoading(true);
    try {
      // For now, just log that we would create a checkout session
      // In production, this would call a server action that creates a Stripe session
      console.log('Would create checkout session for plan:', plan);
      // window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-display font-bold text-warm-deep md:text-5xl">
            Choose your plan
          </h1>
          <p className="text-lg text-warm-deep/60">
            Pick the subscription that works for you
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Monthly Plan */}
          <div className="rounded-3xl border-2 border-gray-200 p-8 hover:border-warm-coral transition-colors">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-display font-bold text-warm-deep">Monthly</h2>
              <div className="mb-4">
                <span className="text-5xl font-display font-bold text-warm-coral">$10</span>
                <span className="text-warm-deep/60">/month</span>
              </div>
              <p className="text-sm text-warm-deep/60">
                Entry into monthly draws with a chance to win
              </p>
            </div>

            <ul className="mb-8 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-warm-deep/70">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warm-sage/20">✓</span>
                Monthly prize draws
              </li>
              <li className="flex items-center gap-3 text-warm-deep/70">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warm-sage/20">✓</span>
                Minimum 10% to charity
              </li>
              <li className="flex items-center gap-3 text-warm-deep/70">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warm-sage/20">✓</span>
                Score tracking
              </li>
            </ul>

            <button
              onClick={() => handleCheckout('monthly')}
              disabled={loading}
              className="w-full rounded-full bg-warm-coral py-3 font-medium text-white hover:bg-[#FF5555] transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Get started'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="rounded-3xl border-2 border-warm-coral p-8 relative">
            <div className="absolute -top-4 left-8 bg-warm-coral text-white px-4 py-1 rounded-full text-xs font-bold">
              SAVE $20
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-display font-bold text-warm-deep">Yearly</h2>
              <div className="mb-4">
                <span className="text-5xl font-display font-bold text-warm-coral">$100</span>
                <span className="text-warm-deep/60">/year</span>
              </div>
              <p className="text-sm text-warm-deep/60">
                Full year of monthly draws and consistent giving
              </p>
            </div>

            <ul className="mb-8 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-warm-deep/70">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warm-sage/20">✓</span>
                12 monthly draws
              </li>
              <li className="flex items-center gap-3 text-warm-deep/70">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warm-sage/20">✓</span>
                Minimum 10% to charity
              </li>
              <li className="flex items-center gap-3 text-warm-deep/70">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warm-sage/20">✓</span>
                Uninterrupted coverage
              </li>
            </ul>

            <button
              onClick={() => handleCheckout('yearly')}
              disabled={loading}
              className="w-full rounded-full bg-warm-deep py-3 font-medium text-white hover:bg-[#152540] transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Get started'}
            </button>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-warm-cream p-8 text-center">
          <h3 className="mb-4 font-display font-bold text-warm-deep">Questions?</h3>
          <p className="text-warm-deep/60 mb-4">
            Contact us at hello@fairwaygiving.co for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
