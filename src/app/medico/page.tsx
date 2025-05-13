// src/app/medico/page.tsx
"use client";

import { MedicoDashboard } from '@/components/medico/medico-dashboard';
import { useProMode } from '@/contexts/pro-mode-context';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'; // Added useState
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2 } from 'lucide-react';
import { MedicoHubAnimation } from '@/components/medico/medico-hub-animation'; // Import the new animation component

export default function MedicoPage() {
  const { userRole } = useProMode();
  const router = useRouter();
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [showMedicoAnimation, setShowMedicoAnimation] = useState(false);


  useEffect(() => {
    if (userRole !== null) { // userRole is determined
      if (userRole === 'medico') {
        setShowMedicoAnimation(true); // Start animation if user is medico
      } else {
        router.push('/'); // Redirect if not medico
      }
      setIsLoadingRole(false); // Role loading is complete
    }
    // If userRole is still null, ProModeProvider is likely still loading it from localStorage
  }, [userRole, router]);

  if (isLoadingRole) {
    return (
      <PageWrapper title="Loading Medico Study Hub...">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }
  
  // If role is not medico and we are past the initial role loading (and not showing animation for medico)
  if (userRole !== 'medico' && !showMedicoAnimation) { 
    return (
      <PageWrapper title="Access Denied">
        <div className="text-center">
          <p className="text-lg">You must be in Medico mode to access this page.</p>
          <p className="text-sm text-muted-foreground">Redirecting to homepage...</p>
        </div>
      </PageWrapper>
    );
  }

  if (showMedicoAnimation && userRole === 'medico') {
    return <MedicoHubAnimation onAnimationComplete={() => setShowMedicoAnimation(false)} />;
  }
  
  // Render dashboard if role is medico, not loading role, and animation is complete
  if (userRole === 'medico' && !isLoadingRole && !showMedicoAnimation) {
    return <MedicoDashboard />;
  }

  // Fallback (e.g. if userRole becomes non-medico after animation started, or some other edge case)
  return (
    <PageWrapper title="Verifying Access...">
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    </PageWrapper>
  );
}
