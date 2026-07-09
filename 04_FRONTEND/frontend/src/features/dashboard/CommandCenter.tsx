'use client';

import React, { useState, useEffect } from 'react';
import { dashboardService, StadiumMetrics } from './dashboardService';
import { useAuthStore } from '../auth/authStore';
import { Activity, ShieldAlert, FileText, Clock, RefreshCw, Layers, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const CommandCenter: React.FC = () => {
  const { token, user } = useAuthStore();
  const [metrics, setMetrics] = useState<StadiumMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardMetrics(token);
      setMetrics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh metrics every 15 seconds
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, [token]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center border rounded-xl bg-surface border-border shadow-md">
        <Shield className="w-12 h-12 mb-4 text-brand-blue" aria-hidden="true" />
        <h2 className="text-xl font-bold text-text-primary">Authentication Required</h2>
        <p className="max-w-md mt-2 text-text-secondary text-sm">
          Please login to view operational dashboard metrics and gate status values.
        </p>
      </div>
    );
  }

  // Restrict access to Command Center only to Operations, Security, and Admin
  const isAuthorized = user && ['OPERATIONS', 'SECURITY', 'ADMIN'].includes(user.role);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center border rounded-xl bg-surface border-border shadow-md">
        <ShieldAlert className="w-12 h-12 mb-4 text-danger" aria-hidden="true" />
        <h2 className="text-xl font-bold text-text-primary">Access Restricted</h2>
        <p className="max-w-md mt-2 text-text-secondary text-sm">
          You do not have the required security role to view the Operations Command Center.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title & Refresh */}
      <div className="p-6 border rounded-2xl bg-surface/75 border-border shadow-lg glass-3 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-danger/10">
            <Activity className="w-6 h-6 text-danger animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Operations Command Center</h2>
            <p className="text-xs text-text-secondary">Stadium OS real-time metrics telemetry console</p>
          </div>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={isLoading}
          aria-label="Refresh operational metrics"
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-divider border border-border/50 text-xs font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Console</span>
        </button>
      </div>

      {error && (
        <div className="p-4 border border-danger/20 bg-danger/10 rounded-xl text-sm text-danger">
          Error loading dashboard metrics: {error}
        </div>
      )}

      {metrics && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Health Score */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 border rounded-2xl bg-surface/75 border-border shadow-md glass-3 space-y-4"
            >
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Stadium Health</span>
                <div className="p-1.5 rounded-lg bg-success/10 text-success">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-text-primary tracking-tight tabular-nums">
                  {metrics.healthScore}%
                </p>
                <p className="text-[11px] text-success font-medium mt-1">Normal Operating State</p>
              </div>
            </motion.div>

            {/* Active Incidents */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-5 border rounded-2xl bg-surface/75 border-border shadow-md glass-3 space-y-4"
            >
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Incidents</span>
                <div className="p-1.5 rounded-lg bg-danger/10 text-danger">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-text-primary tracking-tight tabular-nums">
                  {metrics.activeIncidentsCount}
                </p>
                <p className={`text-[11px] font-medium mt-1 ${metrics.activeIncidentsCount > 0 ? 'text-danger' : 'text-success'}`}>
                  {metrics.activeIncidentsCount > 0 ? 'Needs Urgent Attention' : 'Zero reported alerts'}
                </p>
              </div>
            </motion.div>

            {/* Tickets Scanned */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 border rounded-2xl bg-surface/75 border-border shadow-md glass-3 space-y-4"
            >
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Tickets Scanned</span>
                <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-text-primary tracking-tight tabular-nums">
                  {metrics.totalTicketsScanned}
                </p>
                <p className="text-[11px] text-text-secondary font-medium mt-1">Total stadium occupancy entry</p>
              </div>
            </motion.div>

            {/* Average Wait Time */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 border rounded-2xl bg-surface/75 border-border shadow-md glass-3 space-y-4"
            >
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Wait Time</span>
                <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-text-primary tracking-tight tabular-nums">
                  {metrics.avgWaitTimeMinutes}m
                </p>
                <p className="text-[11px] text-text-secondary font-medium mt-1">Across all entrance checkpoints</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gate Throughput Status */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-purple" />
                <span>Gate Throughput Rates</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metrics.gateStatus.map((g, idx) => (
                  <motion.div
                    key={g.gate}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 border rounded-xl bg-surface/50 border-border/50 shadow-sm glass-2 space-y-3"
                  >
                    <div className="flex justify-between items-center text-sm font-bold text-text-primary">
                      <span>{g.gate}</span>
                      <span className="text-xs text-success font-bold">{g.status}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-secondary uppercase">Throughput rate</span>
                      <p className="text-base font-bold text-text-primary tabular-nums">
                        {g.throughput} fans / hr
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* OS Infrastructure Load */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
                <Activity className="w-4 h-4 text-brand-cyan" />
                <span>Infrastructure System Load</span>
              </h3>

              <div className="p-5 border rounded-2xl bg-surface/50 border-border/50 shadow-md glass-2 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-secondary font-semibold">
                    <span>CPU / Memory Load</span>
                    <span>{metrics.systemLoadPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-divider rounded-full overflow-hidden">
                    <div
                      style={{ width: `${metrics.systemLoadPercent}%` }}
                      className="h-full rounded-full bg-brand-cyan transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">
                    Console telemetry last updated
                  </span>
                  <p className="text-xs text-text-primary font-bold mt-1">
                    {new Date(metrics.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
