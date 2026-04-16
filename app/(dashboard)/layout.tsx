import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, PieChart, Trophy, Heart, Gift, LogOut } from 'lucide-react';

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/scores', label: 'Scores', icon: PieChart },
    { href: '/draws', label: 'Draws', icon: Trophy },
    { href: '/charity', label: 'Charity', icon: Heart },
    { href: '/winnings', label: 'Winnings', icon: Gift },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-gray-100 bg-white lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-warm-coral to-warm-sunrise">
              <span className="text-lg font-bold text-white font-display">F</span>
            </div>
            <span className="font-display font-bold text-warm-deep">Fairway</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-warm-deep hover:bg-warm-cream transition-colors"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-6">
          <div className="mb-4">
            <p className="text-xs text-warm-deep/60 mb-1">Signed in as</p>
            <p className="text-sm font-medium text-warm-deep truncate">{profile?.full_name || user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-warm-coral hover:bg-warm-coral/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="border-b border-gray-100 bg-white px-8 py-4">
          <p className="text-sm text-warm-deep/60">Dashboard</p>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
