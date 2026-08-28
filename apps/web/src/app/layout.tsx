import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solvear.in - All-in-One WhatsApp Marketing, AI Chatbot & CPaaS Platform',
  description:
    'Turn WhatsApp into your #1 Sales Channel. Chat, sell & scale with AI across WhatsApp, Instagram, Telegram, Facebook Messenger & Webchat. WooCommerce, Shopify, Catalogs, Form Flows, and White-Label Reseller solution.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
