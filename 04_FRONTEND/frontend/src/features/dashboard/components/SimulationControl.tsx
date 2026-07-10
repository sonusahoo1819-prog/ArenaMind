'use client';

import React from 'react';
import { Play, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

type SimMode = 'NORMAL' | 'HALFTIME' | 'EXIT' | 'EMERGENCY';

interface SimulationControlProps {
  simMode: SimMode;
  setSimMode: (mode: SimMode) => void;
  theme: 'dark' | 'light';
}

export const SimulationControl: React.FC<SimulationControlProps> = ({
  simMode,
  setSimMode,
  theme,
}) => {
  return (
    <div
      className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-[#0057FF]/5 to-transparent border-zinc-800/40'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-[#0057FF]/10">
          <Play className="w-4.5 h-4.5 text-[#00E5FF] animate-pulse" />
        </div>
        <div className="text-left">
          <h3 className="text-xs font-bold tracking-wide">Stadium Operations Simulation</h3>
          <p className="text-[10px] text-zinc-500">
            Inject event loads, crowd congestion, and emergency alarm states
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(['NORMAL', 'HALFTIME', 'EXIT', 'EMERGENCY'] as SimMode[]).map((mode) => (
          <motion.button
            key={mode}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSimMode(mode)}
            className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
              simMode === mode
                ? mode === 'EMERGENCY'
                  ? 'bg-[#FF1744] text-white shadow-[0_0_15px_rgba(255,23,68,0.4)]'
                  : 'bg-[#0057FF] text-white shadow-[0_0_15px_rgba(0,87,255,0.4)]'
                : theme === 'dark'
                  ? 'bg-zinc-900/60 border border-zinc-800/40 text-zinc-400 hover:text-white'
                  : 'bg-zinc-100 border border-gray-300 text-zinc-600 hover:text-zinc-950'
            }`}
          >
            {mode === 'EMERGENCY' && <AlertTriangle className="w-3.5 h-3.5 text-white" />}
            <span>{mode}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
