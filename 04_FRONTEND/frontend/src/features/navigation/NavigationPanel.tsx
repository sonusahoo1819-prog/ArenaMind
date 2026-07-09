'use client';

import React, { useState } from 'react';
import { navigationService } from './navigationService';
import { useAuthStore } from '../auth/authStore';
import { NavigationRoute } from './index';
import { Navigation, Compass, Accessibility, AlertTriangle, ArrowRight, Loader2, List, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const NavigationPanel: React.FC = () => {
  const { token } = useAuthStore();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [accessible, setAccessible] = useState(false);
  const [emergency, setEmergency] = useState(false);
  
  const [route, setRoute] = useState<NavigationRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start.trim() || !end.trim() || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await navigationService.getRoute(start, end, accessible, emergency, token);
      setRoute(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerEmergencySOS = () => {
    setEmergency(true);
    setStart('Current Position');
    setEnd('Nearest Safe Evacuation Exit');
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center border rounded-xl bg-surface border-border shadow-md">
        <Shield className="w-12 h-12 mb-4 text-brand-blue" aria-hidden="true" />
        <h2 className="text-xl font-bold text-text-primary">Authentication Required</h2>
        <p className="max-w-md mt-2 text-text-secondary text-sm">
          Please login to access the stadium indoor & outdoor navigation systems.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Console */}
      <div className="p-6 border rounded-2xl bg-surface/75 border-border shadow-lg glass-3">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-brand-blue/10">
            <Navigation className="w-6 h-6 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Stadium Route Planner</h2>
            <p className="text-xs text-text-secondary">Indoor & Outdoor Dynamic Navigation</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="start-point" className="text-xs font-semibold text-text-secondary mb-1">
                Start Point
              </label>
              <input
                id="start-point"
                type="text"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="e.g. Gate 4, Parking B"
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-blue text-sm transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-point" className="text-xs font-semibold text-text-secondary mb-1">
                Destination Point
              </label>
              <input
                id="end-point"
                type="text"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="e.g. Section 204, Food Court"
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-blue text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-text-primary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={accessible}
                  onChange={(e) => setAccessible(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-brand-blue focus:ring-brand-blue focus:ring-offset-background"
                />
                <Accessibility className="w-4 h-4 text-brand-cyan" />
                <span>Wheelchair Accessible</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-text-primary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emergency}
                  onChange={(e) => setEmergency(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-danger focus:ring-danger focus:ring-offset-background"
                />
                <AlertTriangle className="w-4 h-4 text-danger" />
                <span className="text-danger font-medium">Emergency Route</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-medium text-sm disabled:opacity-50 disabled:hover:bg-brand-blue transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <span>Find Route</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-divider flex justify-end">
          <button
            onClick={triggerEmergencySOS}
            className="px-4 py-2 rounded-xl bg-danger/10 hover:bg-danger text-danger hover:text-white font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer border border-danger/20"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>INSTANT SOS ROUTING</span>
          </button>
        </div>
      </div>

      {/* Route Display Console */}
      {error && (
        <div className="p-4 border border-danger/20 bg-danger/10 rounded-xl text-sm text-danger">
          Error: {error}
        </div>
      )}

      {route && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border rounded-2xl bg-surface/75 border-border shadow-lg glass-3 space-y-6"
        >
          {/* Summary Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-divider/50 border border-border/30">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${route.isEmergency ? 'bg-danger/20 text-danger' : 'bg-brand-blue/10 text-brand-blue'}`}>
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-text-secondary">ESTIMATED TIME</span>
                <p className="text-lg font-bold text-text-primary tabular-nums">
                  {route.routeData.estimatedTimeMin} mins
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs text-text-secondary">DISTANCE</span>
              <p className="text-lg font-bold text-text-primary tabular-nums">
                {route.routeData.distanceMeters} meters
              </p>
            </div>

            <div>
              <span className="text-xs text-text-secondary">CONGESTION STATUS</span>
              <p className={`text-sm font-bold uppercase ${
                route.crowdMetadata?.congestionLevel === 'CRITICAL' || route.crowdMetadata?.congestionLevel === 'HIGH'
                  ? 'text-danger'
                  : 'text-success'
              }`}>
                {route.crowdMetadata?.congestionLevel || 'LOW'}
              </p>
            </div>
          </div>

          {/* Instructions Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
              <List className="w-4 h-4 text-brand-purple" />
              <span>Turn-by-Turn Navigation</span>
            </h3>

            <div className="relative pl-6 border-l-2 border-divider space-y-6">
              {route.routeData.instructions.map((inst, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-brand-blue bg-surface flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  </div>
                  <p className="text-sm text-text-primary">{inst}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
