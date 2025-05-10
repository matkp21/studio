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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="MediAssistant" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MediAssistant" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#266D99" /> 
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="hsl(210, 100%, 50%)" />

        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        
        {/* Fallback for older browsers or specific PWA scenarios */}
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}

        {/* Example placeholder for splash screens - actual images not generated */}
        {/* <link rel="apple-touch-startup-image" href="/images/apple_splash_2048.png" sizes="2048x2732" /> */}
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
