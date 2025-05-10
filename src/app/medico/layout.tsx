// src/app/medico/layout.tsx
import type { ReactNode } from 'react';
import { MedicoHeader } from '@/components/layout/medico-header';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function MedicoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MedicoHeader />
      <PageWrapper className="flex-grow py-6 sm:py-10">
        {children}
      </PageWrapper>
      {/* You can add a Medico-specific footer here if needed */}
    </div>
  );
}
