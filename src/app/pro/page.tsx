// src/app/pro/page.tsx
"use client";

import { ProModeDashboard } from '@/components/pro/pro-dashboard'; // Updated import
import { useProMode } from '@/contexts/pro-mode-context';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'; // Added useState
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2 } from 'lucide-react';

export default function ProPage() {
  const { userRole } = useProMode();
  const router = useRouter();
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    // Check if userRole is determined (not null)
    if (userRole !== null) {
      setIsLoadingRole(false);
      if (userRole !== 'pro') {
        router.push('/'); 
      }
    }
    // If userRole is still null, it means it's still being loaded from localStorage by ProModeProvider
  }, [userRole, router]);

  if (isLoadingRole) {
    return (
      <PageWrapper title="Loading Professional Suite...">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (userRole !== 'pro') {
    // This part might not be reached if redirect happens, but good as a fallback
    return (
      <PageWrapper title="Access Denied">
        <div className="text-center">
          <p className="text-lg">You must be in Professional mode to access this page.</p>
          <p className="text-sm text-muted-foreground">Redirecting to homepage...</p>
        </div>
      </PageWrapper>
    );
  }

  return <ProModeDashboard />; 
}
