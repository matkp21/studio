// src/app/layout.tsx
// Remove "use client" - this is now a Server Component
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google'; // Changed from Poppins
import './globals.css';
// Toaster will be rendered by ClientLayoutWrapper
// ProModeProvider will be rendered by ClientLayoutWrapper
// AppLayout will be rendered by ClientLayoutWrapper
// useEffect for SW registration will be in ClientLayoutWrapper
import { ClientLayoutWrapper } from '@/components/layout/client-layout-wrapper';

const noto_sans = Noto_Sans({ // Changed from Poppins
  subsets: ['latin', 'devanagari', 'malayalam'],
  weight: ['300', '400', '500', '600', '700'],
  // No variable needed, will apply classname directly
});

// metadata can be exported from a Server Component
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Standard PWA meta tags are handled by Next.js metadata object */}
        <meta name="theme-color" content="hsl(180, 100%, 25%)" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="hsl(216, 65%, 11%)" media="(prefers-color-scheme: dark)" />
        
        {/* <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" /> */}
        {/* Add more apple-touch-icon sizes if available */}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" /> */}
        
        {/* Other meta tags from previous state */}
        {/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}

        {/* Script for <model-viewer> web component */}
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" async></script>
      </head>
      <body className={`${noto_sans.className} antialiased`}>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
