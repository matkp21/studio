// src/app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ProModeProvider } from '@/contexts/pro-mode-context';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'MediAssistant',
  description: 'AI-Powered Medical Assistant',
  manifest: '/manifest.json', // PWA manifest
  applicationName: "MediAssistant",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MediAssistant",
    // startupImage: [ // TODO: Add startup images for various iOS devices
    //   { url: '/splash/iphone5_splash.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' },
    // ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "msapplication-TileColor": "#008080", // Teal
    "msapplication-tap-highlight": "no",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Register service worker here for PWA offline capabilities and push notifications in a useEffect hook.
  // Example:
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     window.addEventListener('load', () => {
  //       navigator.serviceWorker.register('/sw.js').then(registration => {
  //         console.log('SW registered: ', registration);
  //       }).catch(registrationError => {
  //         console.log('SW registration failed: ', registrationError);
  //       });
  //     });
  //   }
  // }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Standard PWA meta tags are handled by Next.js metadata object */}
        <meta name="theme-color" content="hsl(180, 100%, 25%)" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="hsl(216, 65%, 11%)" media="(prefers-color-scheme: dark)" />
        
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* Add more apple-touch-icon sizes if available */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        
        {/* Other meta tags from previous state */}
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <ProModeProvider>
          <AppLayout>{children}</AppLayout>
        </ProModeProvider>
        <Toaster />
      </body>
    </html>
  );
}
