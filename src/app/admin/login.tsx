'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { authenticate } from '@/lib/auth';

const brandFont = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const user = await authenticate(email, password);
    setLoading(false);
    if (!user || user.role !== 'admin') {
      setError('Admin access only. Please use an admin account.')
      return
    }
    // Supabase session is automatically set
    router.replace('/admin');
  }

  return (
    <div className="center">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.35)] bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between p-10 text-cream bg-[color:var(--color-coffee)]">
            <div>
              <div className={`text-2xl tracking-wide ${brandFont.className}`}>BREW POS</div>
              <div className="mt-2 text-sm text-cream/80">
                Welcome to BREW POS, the all-in-one solution for your cafe.
              </div>
              <div className="mt-6 text-sm">
                Create an account to get started.
              </div>
              <div className="mt-4">
                <button className="button buttonSecondary">Sign up</button>
              </div>
            </div>
            <div className="text-xs text-cream/65">
              Only admin accounts can proceed.
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-coffee">Admin sign in</div>
                <div className="mt-1 text-sm text-coffee/70">Enter your admin credentials</div>
              </div>
              <div className={`lg:hidden text-base font-extrabold text-coffee ${brandFont.className}`}>BREW POS</div>
            </div>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-coffee/80">
                  <Mail className="h-4 w-4 text-coffee/45" />
                  Email
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    type="email"
                    className="input bg-cream/50"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-coffee/80">
                  <Lock className="h-4 w-4 text-coffee/45" />
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input bg-cream/50 pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-coffee/60 hover:bg-black/5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-100">{error}</div>}

              <button type="submit" className="button buttonPrimary buttonFull" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
