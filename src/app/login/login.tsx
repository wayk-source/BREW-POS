'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { authenticate, setSession } from '@/lib/auth';

const brandFont = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

export default function Login() {
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
    if (!user) {
      setError('Invalid email or password.');
      return;
    }
    setSession(user);
    // Redirect based on role
    if (user.role === 'owner') return router.replace('/owner');
    if (user.role === 'manager') return router.replace('/manager');
    if (user.role === 'cashier') return router.replace('/cashier');
    if (user.role === 'admin') return router.replace('/admin');
    router.replace('/');
  }

  return (
    <div className="center">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.35)] bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between p-10 text-cream bg-[color:var(--color-coffee)]">
            <div>
              <div className={`text-2xl tracking-wide ${brandFont.className}`}>BREW POS</div>
              <div className="mt-2 text-sm text-cream/80">
                Sign in to access your portal and manage daily operations.
              </div>
              <div className="mt-6 grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <Lock className="h-4 w-4" />
                  </span>
                  <span className="text-cream/90">Secure, role-based access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="text-cream/90">Fast login for Owner, Manager, Cashier</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-cream/65">
              Use an account from your database (user_owner, user_manager, user_cashier, user_admin).
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-coffee">Welcome back</div>
                <div className="mt-1 text-sm text-coffee/70">Sign in to continue</div>
              </div>
              <div className={`lg:hidden text-base font-extrabold text-coffee ${brandFont.className}`}>BREW POS</div>
            </div>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-coffee/80">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee/45" />
                  <input
                    id="email"
                    type="email"
                    className="input pl-10 bg-cream/50"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-coffee/80">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee/45" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10 bg-cream/50"
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

              <div className="text-xs text-coffee/60 text-center">
                By continuing, you agree to the platform policies and security guidelines.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
