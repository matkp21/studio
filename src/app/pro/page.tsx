// src/app/pro/page.tsx
"use client";

import { ProDashboard } from '@/components/pro/pro-dashboard';
import { useProMode } from '@/contexts/pro-mode-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function ProPage() {
  const { userRole } = useProMode();
  const router = useRouter();

  useEffect(() => {
    if (userRole !== 'pro') {
      // Redirect to home or another appropriate page if not in pro role
      router.push('/'); 
    }
  }, [userRole, router]);

  if (userRole !== 'pro') {
    return (
      <PageWrapper title="Access Denied">
        <p>You must be in Professional mode to access this page. Redirecting...</p>
      </PageWrapper>
    );
  }

  return <ProDashboard />;
}