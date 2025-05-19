// src/app/page.tsx
"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { HeroSection } from '@/components/homepage/hero-section'; 
import { ModeSwitcher, type ActiveMode } from '@/components/homepage/mode-switcher';
import { SymptomAnalysisMode } from '@/components/homepage/symptom-analysis-mode';
import { ImageProcessingMode } from '@/components/homepage/image-processing-mode';
import { EducationalSupportMode } from '@/components/homepage/educational-support-mode';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { useProMode } from '@/contexts/pro-mode-context'; // Import useProMode
import { PersonalizedClinicalDashboard } from '@/components/pro/personalized-clinical-dashboard'; // Import new dashboard

export default function HomePage() {
  const { userRole } = useProMode();
  // Adjust initial activeMode based on userRole if necessary, or handle in useEffect
  const [activeMode, setActiveMode] = useState<ActiveMode>('symptom'); 

  useEffect(() => {
    // If user is 'pro' and current activeMode is 'education', switch to 'dashboard'
    // Or, if current activeMode is 'dashboard' but user is not 'pro', switch to 'education'
    if (userRole === 'pro' && activeMode === 'education') {
      setActiveMode('dashboard');
    } else if (userRole !== 'pro' && activeMode === 'dashboard') {
      setActiveMode('education');
    }
  }, [userRole, activeMode]);


  let currentModeComponent: ReactNode;
  switch (activeMode) {
    case 'symptom':
      currentModeComponent = <SymptomAnalysisMode />;
      break;
    case 'image':
      currentModeComponent = <ImageProcessingMode />;
      break;
    case 'education':
      // Render EducationalSupportMode only if user is not 'pro'
      currentModeComponent = userRole !== 'pro' ? <EducationalSupportMode /> : <div>Select a mode</div>;
      break;
    case 'dashboard':
      // Render PersonalizedClinicalDashboard only if user is 'pro'
      currentModeComponent = userRole === 'pro' ? <PersonalizedClinicalDashboard /> : <div>Select a mode</div>;
      break;
    default:
      currentModeComponent = <div>Select a mode</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <PageWrapper className="py-8 sm:py-12 flex-grow">
        <ModeSwitcher activeMode={activeMode} setActiveMode={setActiveMode} />
        <div className="mt-8 md:mt-12 content-area">
          <div className={activeMode === 'symptom' ? 'active-mode' : 'inactive-mode'}>
            {activeMode === 'symptom' && <SymptomAnalysisMode />}
          </div>
          <div className={activeMode === 'image' ? 'active-mode' : 'inactive-mode'}>
             {activeMode === 'image' && <ImageProcessingMode />}
          </div>
          <div className={activeMode === 'education' && userRole !== 'pro' ? 'active-mode' : 'inactive-mode'}>
            {activeMode === 'education' && userRole !== 'pro' && <EducationalSupportMode />}
          </div>
           <div className={activeMode === 'dashboard' && userRole === 'pro' ? 'active-mode' : 'inactive-mode'}>
            {activeMode === 'dashboard' && userRole === 'pro' && <PersonalizedClinicalDashboard />}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
