import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/cart-context';
import { ToastProvider } from '@/context/toast-context';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'TrackOps | Enterprise Operations, Link Management & Telemetry Intelligence',
  description:
    'TrackOps: High-assurance enterprise platform for role-based operations, access approvals, link management, and privacy-friendly telemetry analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen font-sans antialiased flex flex-col justify-between">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <AppShell>{children}</AppShell>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
