'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  announce: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hc = localStorage.getItem('accessibility-hc') === 'true';
      const lt = localStorage.getItem('accessibility-lt') === 'true';
      setHighContrast(hc);
      setLargeText(lt);
    }
  }, []);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('accessibility-hc', String(next));
    announce(next ? 'High Contrast Mode Enabled' : 'High Contrast Mode Disabled');
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    localStorage.setItem('accessibility-lt', String(next));
    announce(next ? 'Large Text Mode Enabled' : 'Large Text Mode Disabled');
  };

  const announce = (message: string) => {
    setAnnouncement(message);
    // Clear announcement after a delay so it can be re-announced if identical
    setTimeout(() => setAnnouncement(''), 3000);
  };

  // Keyboard shortcut listener: Alt + C for contrast, Alt + T for text size
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        toggleHighContrast();
      }
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleLargeText();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [highContrast, largeText]);

  return (
    <AccessibilityContext.Provider value={{ highContrast, largeText, toggleHighContrast, toggleLargeText, announce }}>
      <div
        className={`${highContrast ? 'theme-high-contrast' : ''} ${largeText ? 'text-lg font-medium' : ''}`}
        style={largeText ? { fontSize: '115%' } : undefined}
      >
        {/* ARIA Live region for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only absolute w-1 h-1 p-0 -m-1 overflow-hidden clip-rect-0 border-0"
        >
          {announcement}
        </div>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
