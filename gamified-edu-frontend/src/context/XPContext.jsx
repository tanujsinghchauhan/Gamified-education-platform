import React, { createContext, useState, useContext } from 'react';

const XPContext = createContext(null);

export const XPProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerXPRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const xpContextValue = {
    refreshTrigger,
    triggerXPRefresh,
  };

  return (
    <XPContext.Provider value={xpContextValue}>
      {children}
    </XPContext.Provider>
  );
};

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};