// src/app/medico/page.tsx
"use client";

import { MedicoDashboard } from '@/components/medico/medico-dashboard';
import { useProMode } from '@/contexts/pro-mode-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function MedicoPage() {
  const { userRole } = useProMode();
  const router = useRouter();

  useEffect(() => {
    if (userRole !== 'medico') {
      // Redirect to home or another appropriate page if not in medico role
      // This is a client-side check; ideally, protect routes server-side too
      router.push('/'); 
    }
  }, [userRole, router]);

  if (userRole !== 'medico') {
    // Optionally show a loading or unauthorized message while redirecting
    return (
      <PageWrapper title="Access Denied">
        <p>You must be in Medico mode to access this page. Redirecting...</p>
      </PageWrapper>
    );
  }

  return <MedicoDashboard />;
}
