'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { authenticate, signup } from '@/lib/auth';
import { Modal } from '@/components/ui/Modal';

const brandFont = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

export default function Login() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sign up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpBusinessName, setSignUpBusinessName] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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
    if (user.role === 'admin') {
      setError('Please sign in via the admin login at /admin/login.')
      return
    }
    // Supabase session is automatically set after successful authentication
    // Redirect based on role
    if (user.role === 'owner') return router.replace('/owner');
    if (user.role === 'manager') return router.replace('/manager');
    if (user.role === 'cashier') return router.replace('/cashier');
    // Fallback redirect
    router.replace('/');
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setSignUpError(null);
    
    // Validation
    if (!signUpName.trim()) {
      setSignUpError('Please enter your name');
      return;
    }
    if (!signUpBusinessName.trim()) {
      setSignUpError('Please enter your business name');
      return;
    }
    if (!signUpEmail.trim()) {
      setSignUpError('Please enter your email');
      return;
    }
    if (!signUpPassword) {
      setSignUpError('Please enter a password');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters');
      return;
    }
    if (signUpPassword !== confirmPassword) {
      setSignUpError('Passwords do not match');
      return;
    }

    setSignUpLoading(true);
    try {
      const newUser = await signup(signUpEmail, signUpPassword, signUpName, signUpBusinessName);
      setSignUpLoading(false);
      
      if (!newUser) {
        setSignUpError('Signup failed. Please try again.');
        return;
      }
      
      // Show success modal instead of redirecting
      setSignUpSuccess(true);
    } catch (error: any) {
      setSignUpLoading(false);
      const errorMessage = error?.message || 'Signup failed. Please try again.'
      setSignUpError(errorMessage);
      return;
    }

  }

  function openSignUpModal() {
    setIsModalOpen(true);
    setError(null);
    setSignUpError(null);
    // Clear form fields
    setEmail('');
    setPassword('');
    setSignUpName('');
    setSignUpBusinessName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setConfirmPassword('');
  }

  function closeModal() {
    setIsModalOpen(false);
    setError(null);
    setSignUpError(null);
    setSignUpSuccess(false);
  }

  function handleGoToLogin() {
    // Close signup modal and reset form
    closeModal();
    // Clear signup form fields
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setConfirmPassword('');
    setSignUpBusinessName('');
    // Switch to login mode (the modal is already closed, user can see login form)
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
                Don't have an account? Sign up below.
              </div>
              <div className="mt-4">
                <button
                  className="button buttonSecondary"
                  onClick={openSignUpModal}
                >
                  Sign up
                </button>
              </div>
            </div>
            <div className="text-xs text-cream/65 space-y-1">
              <p className="font-semibold">Demo Credentials:</p>
              <p>Owner: owner@brewpos.com / owner123</p>
              <p>Manager: manager@brewpos.com / manager123</p>
              <p>Cashier: cashier@brewpos.com / cashier123</p>
              <p>Admin: admin@brewpos.com / admin123</p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-coffee">
                  Welcome back
                </div>
                <div className="mt-1 text-sm text-coffee/70">
                  Sign in to continue
                </div>
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
                    placeholder="name@example.com"
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

              <div className="text-xs text-coffee/60 text-center">
                By continuing, you agree to the platform policies and security guidelines.
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sign Up Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create account"
      >
        {signUpSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-coffee mb-2">Account Created!</h3>
            <p className="text-coffee/70 mb-6">
              Your account has been successfully created. You can now log in using your credentials.
            </p>
            <button
              type="button"
              onClick={handleGoToLogin}
              className="button buttonPrimary buttonFull"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={onSignUp} className="space-y-4">
            <div>
              <label htmlFor="modalSignUpName" className="flex items-center gap-2 text-sm font-medium text-coffee/80">
                <User className="h-4 w-4 text-coffee/45" />
                Full Name
              </label>
              <div className="mt-1.5">
                <input
                  id="modalSignUpName"
                  type="text"
                  className="input bg-cream/50"
                  placeholder="John Doe"
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modalSignUpBusinessName" className="flex items-center gap-2 text-sm font-medium text-coffee/80">
                <User className="h-4 w-4 text-coffee/45" />
                Business Name
              </label>
              <div className="mt-1.5">
                <input
                  id="modalSignUpBusinessName"
                  type="text"
                  className="input bg-cream/50"
                  placeholder="My Café"
                  value={signUpBusinessName}
                  onChange={e => setSignUpBusinessName(e.target.value)}
                  autoComplete="organization"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modalSignUpEmail" className="flex items-center gap-2 text-sm font-medium text-coffee/80">
                <Mail className="h-4 w-4 text-coffee/45" />
                Email
              </label>
              <div className="mt-1.5">
                <input
                  id="modalSignUpEmail"
                  type="email"
                  className="input bg-cream/50"
                  placeholder="name@example.com"
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modalSignUpPassword" className="flex items-center gap-2 text-sm font-medium text-coffee/80">
                <Lock className="h-4 w-4 text-coffee/45" />
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="modalSignUpPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="input bg-cream/50 pr-10"
                  placeholder="Create a password"
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="modalConfirmPassword" className="flex items-center gap-2 text-sm font-medium text-coffee/80">
                <Lock className="h-4 w-4 text-coffee/45" />
                Confirm Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="modalConfirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="input bg-cream/50"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {signUpError && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-100">{signUpError}</div>}

            <button type="submit" className="button buttonPrimary buttonFull" disabled={signUpLoading}>
              {signUpLoading ? 'Creating account…' : 'Create account'}
            </button>

            <div className="text-xs text-coffee/60 text-center">
              By creating an account, you agree to the platform policies and security guidelines.
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
