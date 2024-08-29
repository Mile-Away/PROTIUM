import React, { createContext, useContext, useState } from 'react';

interface StickyContextProps {
  isSticky: boolean;
  setIsSticky: (value: boolean) => void;
}

const StickyContext = createContext<StickyContextProps | null>(null);

export const StickyProvider = (props: React.PropsWithChildren<{}>) => {
  const [isSticky, setIsSticky] = useState(false);
  return (
    <StickyContext.Provider value={{ isSticky, setIsSticky }}>
      {props.children}
    </StickyContext.Provider>
  );
};

export const useStickyContext = () => {
  const context = useContext(StickyContext);
  if (!context) {
    throw new Error('useStickyContext must be used within a StickyProvider');
  }
  return context;
};
