
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

export type UserRole = 'pro' | 'medico' | 'diagnosis' | null;

interface ProModeContextType {
  isProMode: boolean; // Derived from userRole
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
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    // Load role from localStorage on mount
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') as UserRole : null;
    if (storedRole && ['pro', 'medico', 'diagnosis'].includes(storedRole)) {
      setUserRole(storedRole);
    }
  }, []);

  const selectUserRole = useCallback((role: UserRole) => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem('userRole', role);
      } else {
        localStorage.removeItem('userRole');
      }
    }
  }, []);

  // Derive isProMode from userRole
  const isProMode = useMemo(() => userRole === 'pro', [userRole]);

  return (
    <ProModeContext.Provider value={{ 
      isProMode,
      userRole,
      selectUserRole 
    }}>
      {children}
    </ProModeContext.Provider>
  );
};

