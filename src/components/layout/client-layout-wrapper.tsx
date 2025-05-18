
// src/components/layout/client-layout-wrapper.tsx
"use client"; // This component will handle client-side logic

import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ProModeProvider } from '@/contexts/pro-mode-context';

export function ClientLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <ProModeProvider>
      <AppLayout>{children}</AppLayout>
      <Toaster />
    </ProModeProvider>
  );
}
