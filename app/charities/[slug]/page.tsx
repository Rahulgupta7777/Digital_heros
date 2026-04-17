import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function CharityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: charity } = await supabase
    .from('charities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!charity) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-display font-bold text-warm-deep">Charity not found</h1>
          <Link href="/charities" className="text-warm-coral hover:underline">
            Back to charities
          </Link>
        </div>
      </div>
    );
  }

  const events = (charity.event_info as unknown as Record<string, unknown>[]) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image */}
      <div className="relative h-80 w-full overflow-hidden bg-gray-200">
        <Image
          src={charity.cover_url || '/placeholder.jpg'}
          alt={charity.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-display font-bold text-warm-deep md:text-5xl">
            {charity.name}
          </h1>
          <p className="mb-8 text-lg text-warm-deep/60">
            {charity.short_description}
          </p>

          <div className="mb-12 rounded-3xl bg-warm-cream p-8">
            <h2 className="mb-4 font-display font-bold text-warm-deep">About</h2>
            <p className="text-warm-deep/70 leading-relaxed">
              {charity.long_description}
            </p>
          </div>

          {/* Events */}
          {events.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 font-display font-bold text-warm-deep text-2xl">Upcoming events</h2>
              <div className="space-y-4">
                {events.map((event: Record<string, unknown>, i: number) => (
                  <div key={i} className="rounded-2xl bg-warm-cream p-6 border-l-4 border-warm-coral">
                    <h3 className="mb-2 font-display font-bold text-warm-deep">{String(event.title)}</h3>
                    <p className="text-sm text-warm-deep/60">
                      {String(event.date)} • {String(event.location)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-3xl bg-warm-gradient p-12 text-center">
            <h2 className="mb-4 font-display font-bold text-warm-deep text-2xl">
              Support this cause
            </h2>
            <p className="mb-6 text-warm-deep/60">
              Join Fairway Giving and choose {charity.name} as your charity. 10% minimum of every subscription goes to them.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-full bg-warm-coral text-white hover:bg-[#FF5555] transition-all shadow-soft"
            >
              Get started
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link href="/charities" className="text-warm-coral hover:underline text-sm font-medium">
              ← Back to all charities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
