import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

export const metadata: Metadata = {
  title: 'BREW POS',
  description: 'Simple cafe point of sale',
};

const brandFont = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className={`title ${brandFont.className}`}>BREW POS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: 'var(--muted)' }}>Thursday, 23 June</div>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: '#e2e0d5' }} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
