'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../features/auth/authStore';
import { Role } from '../features/auth/types';
import { Shield, Loader2, Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react';

export const AuthCard: React.FC = () => {
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('FAN');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (isRegister) {
        await register({ email, password, name, role });
        setIsRegister(false);
        alert('Credentials registered successfully. Please log in.');
      } else {
        await login({ email, password });
      }
    } catch (err) {
      // Handled by store error
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-7 rounded-2xl bg-[#081A33]/85 border border-zinc-800/60 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden group">
      
      {/* Laser glow bar overlay */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0057FF] via-[#00E5FF] to-[#0057FF]" />

      <div className="flex flex-col items-center mb-6">
        <div className="p-3 rounded-full bg-[#0057FF]/10 border border-[#00E5FF]/20 mb-3 shadow-[0_0_15px_rgba(0,87,255,0.2)]">
          <Shield className="w-6.5 h-6.5 text-[#00E5FF]" />
        </div>
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider text-center">
          {isRegister ? 'Register Account' : 'Clearance Authentication'}
        </h2>
        <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1 text-center font-bold">
          {isRegister ? 'Establish credentials for stadium access' : 'Enter credentials to authorize gateway access'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {isRegister && (
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800/80 bg-[#05070D]/70 text-white placeholder:text-zinc-650 focus:outline-none focus:border-[#007BFF] focus:shadow-[0_0_8px_rgba(0,123,255,0.2)] text-sm transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800/80 bg-[#05070D]/70 text-white placeholder:text-zinc-650 focus:outline-none focus:border-[#007BFF] focus:shadow-[0_0_8px_rgba(0,123,255,0.2)] text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800/80 bg-[#05070D]/70 text-white placeholder:text-zinc-650 focus:outline-none focus:border-[#007BFF] focus:shadow-[0_0_8px_rgba(0,123,255,0.2)] text-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-350 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isRegister && (
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Primary Role Assignment</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-800/80 bg-[#05070D] text-white focus:outline-none focus:border-[#007BFF] text-sm transition-all cursor-pointer"
            >
              <option value="FAN">Fan</option>
              <option value="VOLUNTEER">Volunteer Staff</option>
              <option value="OPERATIONS">Operations Manager</option>
              <option value="SECURITY">Security Officer</option>
              <option value="MEDICAL">Medical Responder</option>
              <option value="TRANSPORT">Transit Coordinator</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>
        )}

        {!isRegister && (
          <div className="flex items-center justify-between text-xs py-1">
            <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="sr-only"
              />
              <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                rememberMe ? 'bg-[#007BFF] border-[#007BFF]' : 'border-zinc-800 bg-[#05070D]'
              }`}>
                {rememberMe && <Check className="w-2.5 h-2.5 text-white animate-scale-in" />}
              </span>
              <span>Remember clearance</span>
            </label>
            <button type="button" className="text-[#00E5FF] hover:underline cursor-pointer font-bold transition-all">
              Forgot password?
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 text-center text-[#FF1744] bg-[#FF1744]/10 border border-[#FF1744]/20 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          data-magnetic
          className="w-full py-3 rounded-xl bg-[#007BFF] hover:bg-[#007BFF]/95 text-white font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(0,123,255,0.3)]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>{isRegister ? 'Register' : 'Authorize Access'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            clearError();
          }}
          className="hover:underline font-bold text-[#00E5FF] cursor-pointer uppercase tracking-wider text-[10px]"
        >
          {isRegister ? 'Already have clearance? Log In' : 'Need clearance? Register a new profile'}
        </button>
      </div>
    </div>
  );
};
