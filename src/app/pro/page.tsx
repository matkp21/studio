// src/app/pro/page.tsx
"use client";

import { ProModeDashboard } from '@/components/pro/pro-dashboard';
import { useProMode } from '@/contexts/pro-mode-context';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2 } from 'lucide-react';
import { ProSuiteAnimation } from '@/components/pro/pro-suite-animation'; // Import the animation component

export default function ProPage() {
  const { userRole } = useProMode();
  const router = useRouter();
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [showProAnimation, setShowProAnimation] = useState(false);

  useEffect(() => {
    if (userRole !== null) { // userRole is determined
      if (userRole === 'pro') {
        setShowProAnimation(true); // Start animation if user is pro
      } else {
        router.push('/'); // Redirect if not pro
      }
      setIsLoadingRole(false); // Role loading is complete
    }
    // If userRole is still null, ProModeProvider is likely still loading it from localStorage
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

  // If role is not pro and we are past the initial role loading (and not showing animation for pro)
  if (userRole !== 'pro' && !showProAnimation) { 
    return (
      <PageWrapper title="Access Denied">
        <div className="text-center">
          <p className="text-lg">You must be in Professional mode to access this page.</p>
          <p className="text-sm text-muted-foreground">Redirecting to homepage...</p>
        </div>
      </PageWrapper>
    );
  }

  if (showProAnimation && userRole === 'pro') {
    return <ProSuiteAnimation onAnimationComplete={() => setShowProAnimation(false)} />;
  }

  // Render dashboard if role is pro, not loading role, and animation is complete
  if (userRole === 'pro' && !isLoadingRole && !showProAnimation) {
    return <ProModeDashboard />;
  }
  
  // Fallback (e.g. if userRole becomes non-pro after animation started, or some other edge case)
  // This should ideally not be reached if redirection logic is robust.
  return (
    <PageWrapper title="Verifying Access...">
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    </PageWrapper>
  );
}
