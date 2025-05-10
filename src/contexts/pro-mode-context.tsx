
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type UserRole = 'pro' | 'medico' | 'diagnosis' | null;

interface ProModeContextType {
  isProMode: boolean;
  toggleProMode: () => void;
  enableProMode: () => void;
  disableProMode: () => void;
  userRole: UserRole;
  selectUserRole: (role: UserRole) => void;
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
  const [isProModeInternal, setIsProModeInternal] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    // Load role from localStorage on mount
    const storedRole = localStorage.getItem('userRole') as UserRole;
    if (storedRole && ['pro', 'medico', 'diagnosis'].includes(storedRole)) {
      setUserRole(storedRole);
    }
     // Optionally, load isProModeInternal from localStorage too if desired
     const storedProMode = localStorage.getItem('isProMode');
     if (storedProMode === 'true') {
       setIsProModeInternal(true);
     }
  }, []);

  const toggleProMode = useCallback(() => {
    setIsProModeInternal(prev => {
      const newState = !prev;
      localStorage.setItem('isProMode', String(newState));
      return newState;
    });
  }, []);

  const enableProMode = useCallback(() => {
    setIsProModeInternal(true);
    localStorage.setItem('isProMode', 'true');
  }, []);

  const disableProMode = useCallback(() => {
    setIsProModeInternal(false);
    localStorage.setItem('isProMode', 'false');
  }, []);

  const selectUserRole = useCallback((role: UserRole) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }, []);

  return (
    <ProModeContext.Provider value={{ 
      isProMode: isProModeInternal, 
      toggleProMode, 
      enableProMode, 
      disableProMode,
      userRole,
      selectUserRole 
    }}>
      {children}
    </ProModeContext.Provider>
  );
};

