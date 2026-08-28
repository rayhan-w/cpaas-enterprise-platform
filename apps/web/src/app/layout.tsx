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

        {/* Real Official WhatsApp Floating Chat Widget */}
        <a
          href="https://wa.me/918016081188?text=Hello%20Solvear%20Team%2C%20I%20am%20interested%20in%20your%20CPaaS%20platform"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat with Solvear on WhatsApp (+91 80160 81188)"
          aria-label="Chat with Solvear on WhatsApp"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_25px_rgba(37,211,102,0.6)]"
        >
          <img
            src="/whatsapp.svg"
            alt="Official WhatsApp"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </a>
      </body>
    </html>
  );
}
