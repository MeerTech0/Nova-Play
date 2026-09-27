import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  activeGenre: number | null;
  setActiveGenre: (genreId: number | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);

  return (
    <UIContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
        activeGenre,
        setActiveGenre,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
