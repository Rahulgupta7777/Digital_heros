import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default async function ScoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_on', { ascending: false });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-warm-deep">Your scores</h1>
        <Link
          href="#"
          className="rounded-full bg-warm-coral px-6 py-2 text-sm font-medium text-white hover:bg-[#FF5555] transition-all"
        >
          Add score
        </Link>
      </div>

      {!scores || scores.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-soft">
          <p className="text-warm-deep/60 mb-4">No scores yet</p>
          <p className="text-sm text-warm-deep/50 mb-6">Log your last 5 rounds to enter the monthly draw and compete for prizes.</p>
          <button className="rounded-full bg-warm-coral px-6 py-2 text-sm font-medium text-white hover:bg-[#FF5555] transition-all">
            Add your first score
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score) => (
            <div
              key={score.id}
              className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-soft hover:shadow-soft-lg transition-shadow"
            >
              <div>
                <p className="text-sm text-warm-deep/60">{formatDate(score.played_on)}</p>
                <p className="text-lg font-bold text-warm-deep">{score.id}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-display font-bold text-warm-coral">{score.score}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
