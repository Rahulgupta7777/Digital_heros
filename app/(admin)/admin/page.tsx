import { createClient } from '@/lib/supabase/server';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Get stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' });

  const { count: subCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  const { count: pendingWinnersCount } = await supabase
    .from('winners')
    .select('*', { count: 'exact' })
    .eq('verification_status', 'pending');

  return (
    <div className="max-w-6xl">
      <h1 className="mb-8 text-3xl font-display font-bold text-warm-deep">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm text-warm-deep/60 mb-2">Total users</p>
          <p className="text-4xl font-display font-bold text-warm-deep">{userCount || 0}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm text-warm-deep/60 mb-2">Active subscriptions</p>
          <p className="text-4xl font-display font-bold text-warm-sage">{subCount || 0}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm text-warm-deep/60 mb-2">Pending verifications</p>
          <p className="text-4xl font-display font-bold text-warm-coral">{pendingWinnersCount || 0}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm text-warm-deep/60 mb-2">Charities</p>
          <p className="text-4xl font-display font-bold text-warm-sunrise">47</p>
        </div>
      </div>
    </div>
  );
}
