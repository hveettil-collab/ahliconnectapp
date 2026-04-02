'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ViewModeContextType {
  isMobilePreview: boolean;
  setMobilePreview: (v: boolean) => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
  isMobilePreview: true,
  setMobilePreview: () => {},
});

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [isMobilePreview, setMobilePreview] = useState(true);
  return (
    <ViewModeContext.Provider value={{ isMobilePreview, setMobilePreview }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
