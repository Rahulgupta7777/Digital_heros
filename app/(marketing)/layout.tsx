import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-warm-coral to-warm-sunrise">
              <span className="text-lg font-bold text-white font-display">F</span>
            </div>
            <span className="hidden font-display text-xl font-bold text-warm-deep sm:inline">
              Fairway Giving
            </span>
          </Link>

          <nav className="hidden gap-6 md:flex">
            <Link href="/charities" className="text-sm font-medium text-warm-deep hover:text-warm-coral">
              Charities
            </Link>
            <a href="/#how" className="text-sm font-medium text-warm-deep hover:text-warm-coral">
              How it works
            </a>
            <a href="/#impact" className="text-sm font-medium text-warm-deep hover:text-warm-coral">
              Impact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full bg-warm-sage text-warm-deep hover:bg-[#93C7D4] transition-all">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full text-warm-deep hover:bg-warm-cream transition-all">
                  Sign in
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium rounded-full bg-warm-coral text-white hover:bg-[#FF5555] transition-all shadow-soft">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-warm-cream px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-warm-coral to-warm-sunrise">
                  <span className="text-sm font-bold text-white font-display">F</span>
                </div>
                <span className="font-display font-bold text-warm-deep">Fairway Giving</span>
              </div>
              <p className="text-sm text-warm-deep/70">
                Play the game. Change a life.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-display text-sm font-bold text-warm-deep">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/charities" className="text-warm-deep/70 hover:text-warm-coral">Charities</Link></li>
                <li><a href="/#how" className="text-warm-deep/70 hover:text-warm-coral">How it works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-display text-sm font-bold text-warm-deep">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-warm-deep/70 hover:text-warm-coral">Privacy</a></li>
                <li><a href="#" className="text-warm-deep/70 hover:text-warm-coral">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-display text-sm font-bold text-warm-deep">Connect</h4>
              <p className="text-sm text-warm-deep/70">hello@fairwaygiving.co</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-warm-deep/60">
            <p>© 2024 Fairway Giving. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
