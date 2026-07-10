'use client';

import React from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Bell,
  ChevronLeft,
  Compass,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RoleType = 'ORGANIZER' | 'SECURITY' | 'MEDICAL' | 'VOLUNTEER' | 'ACCESSIBILITY' | 'SUSTAINABILITY';

interface WorkspaceHeaderProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  setWorkspaceActive: (active: boolean) => void;
  selectedRole: RoleType;
  setSelectedRole: (role: RoleType) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  user: any;
  logout: () => void;
  metrics: {
    warnings: number;
    alerts: string[];
  };
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  theme,
  setTheme,
  setWorkspaceActive,
  selectedRole,
  setSelectedRole,
  assistantOpen,
  setAssistantOpen,
  notificationsOpen,
  setNotificationsOpen,
  user,
  logout,
  metrics,
}) => {
  const rolesList = [
    { label: 'ORGANIZER', value: 'ORGANIZER' as const },
    { label: 'SECURITY PERSONNEL', value: 'SECURITY' as const },
    { label: 'MEDICAL TEAM', value: 'MEDICAL' as const },
    { label: 'VOLUNTEER CONSOLE', value: 'VOLUNTEER' as const },
    { label: 'ACCESSIBILITY', value: 'ACCESSIBILITY' as const },
    { label: 'SUSTAINABILITY', value: 'SUSTAINABILITY' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <header
        className={`w-full py-4.5 px-6 border-b transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#05070D]/80 border-zinc-800/60' : 'bg-white border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Back to portal button */}
            <button
              onClick={() => setWorkspaceActive(false)}
              title="Return to Portal"
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-white border-gray-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#0057FF]/10 border border-[#0057FF]/30 flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="text-left">
                <span
                  className={`text-xs font-black tracking-wider uppercase block ${
                    theme === 'dark' ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  ArenaMind Stadium OS
                </span>
                <span className="text-[8px] text-[#00E5FF] uppercase font-bold tracking-wider leading-none">
                  Command Center
                </span>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div
            className={`hidden lg:flex items-center space-x-4 border px-4 py-1.5 rounded-full text-xs font-semibold ${
              theme === 'dark'
                ? 'bg-zinc-950/60 border-zinc-800/60 text-zinc-400'
                : 'bg-gray-50 border-gray-200 text-zinc-600'
            }`}
          >
            <span className="text-[#00FF88] animate-pulse">● LIVE</span>
            <span>FIFA WORLD CUP MATCH</span>
            <span className="text-zinc-600">|</span>
            <span>Quarter-Finals: Matchday 22</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* AI Assistant Toggle Button */}
            <button
              onClick={() => setAssistantOpen(!assistantOpen)}
              title="Toggle AI Co-pilot"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-1.5 ${
                assistantOpen
                  ? 'bg-gradient-to-r from-[#0057FF] to-[#00E5FF] text-white border-[#0057FF]/40 shadow-[0_0_15px_rgba(0,87,255,0.4)]'
                  : theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    : 'bg-white border-gray-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline">
                AI Co-pilot
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-white border-gray-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View alerts"
                className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    : 'bg-white border-gray-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Bell className="w-4 h-4" />
                {metrics.warnings > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF1744] text-white text-[8px] font-extrabold flex items-center justify-center animate-pulse">
                    {metrics.warnings}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-3 w-80 border rounded-2xl shadow-2xl overflow-hidden z-50 ${
                      theme === 'dark'
                        ? 'bg-[#081A33]/95 border-zinc-800 text-white'
                        : 'bg-white border-gray-200 text-zinc-800'
                    }`}
                  >
                    <div className="p-3 bg-zinc-950/20 border-b border-zinc-800/20 flex justify-between items-center">
                      <span className="text-xs font-extrabold">System Threat Alerts</span>
                      <span className="text-[8px] bg-[#FF1744]/15 text-[#FF1744] border border-[#FF1744]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                        {metrics.warnings} Alerts
                      </span>
                    </div>
                    <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                      {metrics.alerts.length === 0 ? (
                        <p className="text-[10px] text-zinc-500 text-center py-4">No active threat alerts</p>
                      ) : (
                        metrics.alerts.map((alert, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-zinc-950/10 border border-zinc-800/10 text-xs leading-normal flex items-start space-x-2"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-[#FFB000] flex-shrink-0 mt-0.5" />
                            <span className="text-left">{alert}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div
              className={`flex items-center space-x-2 border px-3 py-1.5 rounded-xl ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#0057FF] flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-[0_0_10px_rgba(0,87,255,0.4)]">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-[8px] text-zinc-500 uppercase font-semibold leading-none mt-1">
                  {user?.role || 'FAN'}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              title="Logout session"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-[#FF1744]/40 hover:bg-[#FF1744]/10'
                  : 'bg-white border-gray-200 text-zinc-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Workspace role view selector */}
      <div
        className={`p-1.5 border rounded-2xl flex flex-wrap gap-1.5 shadow-xl ${
          theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'
        }`}
      >
        {rolesList.map((item) => (
          <motion.button
            key={item.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole(item.value)}
            className={`px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              selectedRole === item.value
                ? 'bg-gradient-to-r from-[#0057FF] to-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,87,255,0.4)]'
                : theme === 'dark'
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-100'
            }`}
          >
            {item.value === 'SECURITY'
              ? 'Security Personnel'
              : item.value === 'MEDICAL'
                ? 'Medical Team'
                : item.value === 'VOLUNTEER'
                  ? 'Volunteer Console'
                  : item.value.toLowerCase()}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
