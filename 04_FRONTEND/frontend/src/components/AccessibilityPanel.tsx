'use client';

import React from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { Accessibility, Eye, Type } from 'lucide-react';

export const AccessibilityPanel: React.FC = () => {
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();

  return (
    <div 
      className="p-4 border rounded-2xl bg-surface/75 border-border shadow-md glass-3 flex items-center justify-between gap-4 max-w-2xl mx-auto" 
      role="region" 
      aria-label="Accessibility settings"
    >
      <div className="flex items-center space-x-2">
        <Accessibility className="w-5 h-5 text-brand-blue" aria-hidden="true" />
        <span className="text-sm font-bold text-text-primary">Accessibility Options</span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            highContrast
              ? 'bg-text-primary text-surface border-text-primary'
              : 'bg-divider text-text-secondary border-border/50 hover:text-text-primary'
          }`}
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>High Contrast (Alt+C)</span>
        </button>

        <button
          onClick={toggleLargeText}
          aria-pressed={largeText}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            largeText
              ? 'bg-text-primary text-surface border-text-primary'
              : 'bg-divider text-text-secondary border-border/50 hover:text-text-primary'
          }`}
        >
          <Type className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Large Text (Alt+T)</span>
        </button>
      </div>
    </div>
  );
};
