'use client';

import React, { useState, useEffect } from 'react';
import { crowdService, PredictionData } from './crowdService';
import { useAuthStore } from '../auth/authStore';
import { Users, AlertCircle, Clock, TrendingUp, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const CrowdPanel: React.FC = () => {
  const { token } = useAuthStore();
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [offset, setOffset] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrowdData = async () => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await crowdService.getPredictions(token, offset);
        setPredictions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrowdData();
  }, [token, offset]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center border rounded-xl bg-surface border-border shadow-md">
        <Shield className="w-12 h-12 mb-4 text-brand-blue" aria-hidden="true" />
        <h2 className="text-xl font-bold text-text-primary">Authentication Required</h2>
        <p className="max-w-md mt-2 text-text-secondary text-sm">
          Please login to view crowd density indicators, queue trackers, and bottleneck predictions.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-danger bg-danger/10 border-danger/20';
      case 'HIGH':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'MEDIUM':
        return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
      default:
        return 'text-success bg-success/10 border-success/20';
    }
  };

  const getDensityBarColor = (density: number) => {
    if (density > 0.8) return 'bg-danger';
    if (density > 0.6) return 'bg-warning';
    if (density > 0.3) return 'bg-brand-blue';
    return 'bg-success';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Control Panel */}
      <div className="p-6 border rounded-2xl bg-surface/75 border-border shadow-lg glass-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-brand-purple/10">
            <Users className="w-6 h-6 text-brand-purple" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Crowd Flow & Congestion Heatmap</h2>
            <p className="text-xs text-text-secondary">AI-Powered Stadium Crowd Management & Real-time Predictions</p>
          </div>
        </div>

        {/* Prediction Offset Selector */}
        <div className="flex items-center space-x-2 bg-divider/50 border border-border/30 p-1.5 rounded-xl text-sm">
          <span className="text-xs text-text-secondary px-2 font-medium">Forecast Interval:</span>
          {[15, 30, 45, 60].map((t) => (
            <button
              key={t}
              onClick={() => setOffset(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                offset === t
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              +{t}m
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
          <span className="text-sm text-text-secondary font-medium">Fetching predictions...</span>
        </div>
      )}

      {error && (
        <div className="p-4 border border-danger/20 bg-danger/10 rounded-xl text-sm text-danger">
          Error loading predictions: {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {predictions.map((pred, index) => (
            <motion.div
              key={pred.zoneId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 border rounded-2xl bg-surface/75 border-border shadow-md glass-3 flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">{pred.zoneId}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getStatusColor(pred.status)}`}>
                  {pred.status}
                </span>
              </div>

              {/* Crowd Density Scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Crowd Density</span>
                  <span>{Math.round(pred.predictedDensity * 100)}%</span>
                </div>
                <div className="h-2.5 w-full bg-divider rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pred.predictedDensity * 100}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${getDensityBarColor(pred.predictedDensity)}`}
                  />
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-brand-blue/10">
                    <TrendingUp className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase">Est. Queue</span>
                    <p className="text-sm font-bold text-text-primary tabular-nums">
                      {pred.predictedQueue} people
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-brand-purple/10">
                    <Clock className="w-4 h-4 text-brand-purple" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase">Wait Time</span>
                    <p className="text-sm font-bold text-text-primary tabular-nums">
                      {pred.predictedWait} mins
                    </p>
                  </div>
                </div>
              </div>

              {/* Congestion warning banner */}
              {pred.predictedDensity > 0.6 && (
                <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-warning font-medium leading-normal">
                    AI predicts a congestion bottleneck at this area in {offset} mins. Re-routing recommended for incoming fans.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
