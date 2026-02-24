 'use client';
 import React, { useState } from 'react';
 import { useRouter } from 'next/navigation';
 import { Montserrat } from 'next/font/google';
 
 const brandFont = Montserrat({
   subsets: ['latin'],
   weight: ['700', '800'],
   display: 'swap',
 });
 
 type Role = 'admin' | 'owner' | 'cashier';
 
 type User = {
   email: string;
   role: Role;
   status: 'active' | 'inactive';
   subscriptionActive: boolean;
 };
 
 function validateEmail(v: string) {
   return /\S+@\S+\.\S+/.test(v);
 }
 
 async function authenticate(email: string, password: string): Promise<User | null> {
   await new Promise((r) => setTimeout(r, 800));
   const users: Record<string, User & { password: string }> = {
     'admin@demo.com': {
       email: 'admin@demo.com',
       role: 'admin',
       status: 'active',
       subscriptionActive: true,
       password: 'password123',
     },
     'owner@demo.com': {
       email: 'owner@demo.com',
       role: 'owner',
       status: 'active',
       subscriptionActive: true,
       password: 'password123',
     },
     'cashier@demo.com': {
       email: 'cashier@demo.com',
       role: 'cashier',
       status: 'active',
       subscriptionActive: true,
       password: 'password123',
     },
     'inactive@demo.com': {
       email: 'inactive@demo.com',
       role: 'owner',
       status: 'inactive',
       subscriptionActive: true,
       password: 'password123',
     },
     'expired@demo.com': {
       email: 'expired@demo.com',
       role: 'owner',
       status: 'active',
       subscriptionActive: false,
       password: 'password123',
     },
   };
   const record = users[email.toLowerCase()];
   if (!record) return null;
   if (record.password !== password) return null;
   return {
     email: record.email,
     role: record.role,
     status: record.status,
     subscriptionActive: record.subscriptionActive,
   };
 }
 
 export default function LoginPage() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
 
   async function onSubmit(e: React.FormEvent) {
     e.preventDefault();
     setError(null);
     if (!validateEmail(email)) {
       setError('Enter a valid email address.');
       return;
     }
     if (password.length < 6) {
       setError('Password must be at least 6 characters.');
       return;
     }
     setLoading(true);
     const user = await authenticate(email, password);
     setLoading(false);
     if (!user) {
       setError('Invalid email or password.');
       return;
     }
     if (user.status !== 'active') {
       setError('Your account is inactive. Contact support.');
       return;
     }
     if (!user.subscriptionActive) {
       setError('Your subscription has expired.');
       return;
     }
     if (user.role === 'admin') {
       router.replace('/admin');
       return;
     }
     if (user.role === 'owner') {
       router.replace('/business');
       return;
     }
     router.replace('/');
   }
 
   return (
     <div className="center">
       <div className="card authCard">
         <div className={`logo ${brandFont.className}`}>BREW POS</div>
         <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
           <div>
             <label htmlFor="email" className="inputLabel">
               Email
             </label>
             <div className="inputGroup">
               <input
                 id="email"
                 type="email"
                 className="input"
                 placeholder="name@example.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 autoComplete="email"
               />
             </div>
           </div>
           <div>
             <label htmlFor="password" className="inputLabel">
               Password
             </label>
             <div className="inputGroup">
               <input
                 id="password"
                 type={showPassword ? 'text' : 'password'}
                 className="input"
                 placeholder="Enter your password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 autoComplete="current-password"
               />
               <button
                 type="button"
                 className="inputToggle"
                 onClick={() => setShowPassword((v) => !v)}
                 aria-label={showPassword ? 'Hide password' : 'Show password'}
               >
                 {showPassword ? 'Hide' : 'Show'}
               </button>
             </div>
             <div style={{ marginTop: 6 }}>
               <a href="#" className="mutedLink">
                 Forgot Password?
               </a>
             </div>
           </div>
           {error && <div className="error">{error}</div>}
           <button
             type="submit"
             className="button buttonPrimary buttonFull"
             disabled={loading}
           >
             {loading ? 'Logging in…' : 'Login'}
           </button>
         </form>
       </div>
     </div>
   );
 }
