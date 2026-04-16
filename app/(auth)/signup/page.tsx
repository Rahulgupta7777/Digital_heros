'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Input, Label, Select } from '@/components/ui/primitives';

type Charity = {
  id: string;
  name: string;
};

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charities, setCharities] = useState<Charity[]>([]);

  useEffect(() => {
    async function loadCharities() {
      const { data } = await supabase
        .from('charities')
        .select('id, name')
        .eq('is_active', true)
        .limit(50);
      if (data) setCharities(data);
    }
    loadCharities();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const charityId = formData.get('charity') as string;

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            selected_charity_id: charityId,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign up failed');

      // Update profile to be safe
      await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          selected_charity_id: charityId,
        })
        .eq('id', authData.user.id);

      router.push('/subscribe');
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-display font-bold text-warm-deep">Join today</h1>
        <p className="text-warm-deep/60">Create your account and start playing</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-warm-coral/10 px-4 py-3 text-sm text-warm-coral border border-warm-coral/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="fullName" className="mb-2 block">
            Full name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="mb-2 block">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            required
          />
        </div>

        <div>
          <Label htmlFor="charity" className="mb-2 block">
            Choose a charity
          </Label>
          <Select id="charity" name="charity" defaultValue={charities[0]?.id || ''}>
            {charities.map((charity) => (
              <option key={charity.id} value={charity.id}>
                {charity.name}
              </option>
            ))}
          </Select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-warm-coral py-3 font-medium text-white hover:bg-[#FF5555] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Get started'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-warm-deep/60">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-warm-coral hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
