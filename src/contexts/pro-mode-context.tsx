"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ProModeContextType {
  isProMode: boolean;
  toggleProMode: () => void;
  enableProMode: () => void;
  disableProMode: () => void;
}

const ProModeContext = createContext<ProModeContextType | undefined>(undefined);

export const useProMode = (): ProModeContextType => {
  const context = useContext(ProModeContext);
  if (!context) {
    throw new Error('useProMode must be used within a ProModeProvider');
  }
  return context;
};

interface ProModeProviderProps {
  children: ReactNode;
}

export const ProModeProvider = ({ children }: ProModeProviderProps) => {
  const [isProMode, setIsProMode] = useState(false);

  const toggleProMode = useCallback(() => {
    setIsProMode(prev => !prev);
  }, []);

  const enableProMode = useCallback(() => {
    setIsProMode(true);
  }, []);

  const disableProMode = useCallback(() => {
    setIsProMode(false);
  }, []);

  return (
    <ProModeContext.Provider value={{ isProMode, toggleProMode, enableProMode, disableProMode }}>
      {children}
    </ProModeContext.Provider>
  );
};
