'use client';

import React from 'react';

interface TelemetryStatsProps {
  occupancyPercent: number;
  theme: 'dark' | 'light';
}

export const TelemetryStats: React.FC<TelemetryStatsProps> = ({
  occupancyPercent,
  theme,
}) => {
  const cardBgClass = theme === 'dark'
    ? 'bg-[#081A33]/70 border-zinc-800/40'
    : 'bg-white border-gray-200 shadow-sm';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
      <div className={`p-5 border rounded-2xl shadow-xl ${cardBgClass}`}>
        <span className="text-[8px] text-zinc-500 uppercase font-bold block">Match Status</span>
        <span className="text-lg font-black block mt-1">2nd Half // 72'</span>
      </div>
      <div className={`p-5 border rounded-2xl shadow-xl ${cardBgClass}`}>
        <span className="text-[8px] text-zinc-500 uppercase font-bold block">Volunteers Active</span>
        <span className="text-lg font-black block mt-1">142 / 150</span>
      </div>
      <div className={`p-5 border rounded-2xl shadow-xl ${cardBgClass}`}>
        <span className="text-[8px] text-zinc-500 uppercase font-bold block">Gate Readiness</span>
        <span className="text-lg font-black text-[#00FF88] block mt-1">100% OPERATIONAL</span>
      </div>
      <div className={`p-5 border rounded-2xl shadow-xl ${cardBgClass}`}>
        <span className="text-[8px] text-zinc-500 uppercase font-bold block">Stadium Capacity Fill</span>
        <span className="text-lg font-black block mt-1 tabular-nums">{occupancyPercent}%</span>
      </div>
    </div>
  );
};
