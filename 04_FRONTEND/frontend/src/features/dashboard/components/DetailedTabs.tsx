'use client';

import React from 'react';
import { Compass, Users, Truck, ShieldAlert } from 'lucide-react';
import { NavigationPanel } from '../../navigation/NavigationPanel';
import { CrowdPanel } from '../../crowd/CrowdPanel';
import { TransportPanel } from '../../transport/TransportPanel';
import { IncidentPanel } from '../../security/IncidentPanel';

type SimMode = 'NORMAL' | 'HALFTIME' | 'EXIT' | 'EMERGENCY';
type DetailsTab = 'navigation' | 'crowd' | 'transport' | 'incidents';

interface DetailedTabsProps {
  activeDetailsTab: DetailsTab;
  setActiveDetailsTab: (tab: DetailsTab) => void;
  simMode: SimMode;
  setSimMode: (mode: SimMode) => void;
}

export const DetailedTabs: React.FC<DetailedTabsProps> = ({
  activeDetailsTab,
  setActiveDetailsTab,
  simMode,
  setSimMode,
}) => {
  const tabs = [
    { id: 'navigation' as const, label: 'Egress Route Guidance', icon: Compass },
    { id: 'crowd' as const, label: 'Scanner Status', icon: Users },
    { id: 'transport' as const, label: 'Transit Dispatch', icon: Truck },
    { id: 'incidents' as const, label: 'Emergency Alerts', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-4">
      {/* Detailed Interactive Panel based on sub-tab */}
      <div className="flex border-b border-zinc-800/40 mb-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDetailsTab(tab.id)}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider flex items-center space-x-2 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                activeDetailsTab === tab.id
                  ? 'border-[#0057FF] text-[#0057FF]'
                  : 'border-transparent text-zinc-500 hover:text-[#0057FF]/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-2 border border-zinc-800/20 rounded-xl bg-zinc-950/10">
        {activeDetailsTab === 'navigation' && <NavigationPanel />}
        {activeDetailsTab === 'crowd' && <CrowdPanel />}
        {activeDetailsTab === 'transport' && <TransportPanel />}
        {activeDetailsTab === 'incidents' && (
          <IncidentPanel simMode={simMode} setSimMode={setSimMode} />
        )}
      </div>
    </div>
  );
};
