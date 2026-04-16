import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, profiles!inner(selected_charity_id)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  // Fetch charity
  const { data: charity } = await supabase
    .from('charities')
    .select('*')
    .eq('id', subscription?.profiles?.selected_charity_id)
    .maybeSingle();

  // Fetch last 5 scores
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_on', { ascending: false })
    .limit(5);

  // Fetch winnings count
  const { count: winningsCount } = await supabase
    .from('winners')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('verification_status', 'approved');

  return (
    <div className="max-w-6xl">
      <h1 className="mb-8 text-3xl font-display font-bold text-warm-deep">Welcome back</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Subscription Status */}
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="mb-4 font-display font-bold text-warm-deep">Subscription</h2>
          {subscription ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-warm-deep/60">Status</p>
                <p className="text-lg font-bold text-warm-sage capitalize">Active</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-warm-deep/60">Plan</p>
                <p className="text-lg font-bold text-warm-deep capitalize">{subscription.plan}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-warm-deep/60">Renews on</p>
                <p className="text-lg font-bold text-warm-deep">
                  {subscription.current_period_end ? formatDate(subscription.current_period_end) : '-'}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="mb-6 text-warm-deep/60">You don&apos;t have an active subscription yet.</p>
              <Link
                href="/subscribe"
                className="inline-block rounded-full bg-warm-coral px-6 py-2 text-sm font-medium text-white hover:bg-[#FF5555] transition-all"
              >
                Choose a plan
              </Link>
            </>
          )}
        </div>

        {/* Charity */}
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="mb-4 font-display font-bold text-warm-deep">Your charity</h2>
          {charity ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-warm-deep/60 mb-2">Supporting</p>
                <p className="text-lg font-bold text-warm-deep">{charity.name}</p>
              </div>
              <p className="mb-6 text-sm text-warm-deep/60">{charity.short_description}</p>
              <Link
                href="/charity"
                className="text-sm font-medium text-warm-coral hover:underline"
              >
                Change charity →
              </Link>
            </>
          ) : (
            <p className="text-warm-deep/60">No charity selected.</p>
          )}
        </div>

        {/* Scores */}
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-warm-deep">Recent scores</h2>
            <Link href="/scores" className="text-sm font-medium text-warm-coral hover:underline">
              View all →
            </Link>
          </div>
          {scores && scores.length > 0 ? (
            <div className="space-y-3">
              {scores.map((score) => (
                <div key={score.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                  <span className="text-warm-deep/70">{formatDate(score.played_on)}</span>
                  <span className="font-bold text-warm-coral text-lg">{score.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-warm-deep/60 text-sm">No scores yet. Add your first score to enter draws.</p>
          )}
        </div>

        {/* Winnings */}
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-warm-deep">Winnings</h2>
            <Link href="/winnings" className="text-sm font-medium text-warm-coral hover:underline">
              View all →
            </Link>
          </div>
          <div className="text-4xl font-display font-bold text-warm-coral mb-2">
            {winningsCount || 0}
          </div>
          <p className="text-sm text-warm-deep/60">Approved wins</p>
        </div>
      </div>
    </div>
  );
}
