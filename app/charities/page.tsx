import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function CharitiesPage() {
  const supabase = await createClient();

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false });

  const featured = charities?.find((c) => c.is_featured);
  const others = charities?.filter((c) => !c.is_featured) ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-4xl font-display font-bold text-warm-deep md:text-5xl">
            Supported charities
          </h1>
          <p className="mb-12 text-lg text-warm-deep/60 max-w-2xl">
            Every subscription supports the causes you care about. Choose your charity and see your impact grow every month.
          </p>

          {/* Featured Charity */}
          {featured && (
            <div className="mb-16 rounded-3xl bg-warm-cream overflow-hidden">
              <div className="grid gap-8 lg:grid-cols-2 items-center">
                <div className="relative h-64 lg:h-full min-h-96 overflow-hidden">
                  <Image
                    src={featured.cover_url || '/placeholder.jpg'}
                    alt={featured.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <div className="mb-4 inline-block rounded-full bg-warm-coral bg-opacity-10 px-4 py-2 text-sm font-medium text-warm-coral">
                    Featured
                  </div>
                  <h2 className="mb-4 text-3xl font-display font-bold text-warm-deep">{featured.name}</h2>
                  <p className="mb-6 text-warm-deep/70">{featured.long_description}</p>
                  <Link
                    href={`/charities/${featured.slug}`}
                    className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-full bg-warm-coral text-white hover:bg-[#FF5555] transition-all"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Other Charities Grid */}
          <div>
            <h3 className="mb-8 text-2xl font-display font-bold text-warm-deep">All charities</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {others.map((charity) => (
                <Link
                  key={charity.id}
                  href={`/charities/${charity.slug}`}
                  className="group rounded-3xl bg-warm-cream p-8 hover:shadow-soft-lg transition-all hover:scale-105"
                >
                  <div className="mb-4 h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={charity.logo_url || '/placeholder.jpg'}
                      alt={charity.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 font-display font-bold text-warm-deep group-hover:text-warm-coral transition-colors">
                    {charity.name}
                  </h3>
                  <p className="text-sm text-warm-deep/60 mb-4">
                    {charity.short_description}
                  </p>
                  <span className="text-sm font-medium text-warm-coral">Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
