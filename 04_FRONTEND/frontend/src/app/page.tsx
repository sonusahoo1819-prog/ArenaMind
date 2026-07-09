'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../features/auth/authStore';
import { AuthCard } from '../components/AuthCard';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { ChatPanel } from '../features/assistant/ChatPanel';
import { NavigationPanel } from '../features/navigation/NavigationPanel';
import { CrowdPanel } from '../features/crowd/CrowdPanel';
import { TransportPanel } from '../features/transport/TransportPanel';
import { IncidentPanel } from '../features/security/IncidentPanel';
import { HologramStadium } from '../components/HologramStadium';
import { HologramFootball } from '../components/HologramFootball';
import { CustomCursor } from '../components/CustomCursor';
import {
  Sparkles,
  User,
  ShieldAlert,
  LogOut,
  Compass,
  Users,
  Truck,
  Activity,
  Shield,
  Bell,
  TrendingUp,
  Clock,
  AlertTriangle,
  Play,
  Gauge,
  Calendar,
  Layers,
  HelpCircle,
  Accessibility,
  Leaf,
  Sun,
  Moon,
  Info,
  Volume2,
  Lock,
  ArrowRight,
  X,
  ChevronLeft,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SimMode = 'NORMAL' | 'HALFTIME' | 'EXIT' | 'EMERGENCY';
type RoleType = 'ORGANIZER' | 'SECURITY' | 'MEDICAL' | 'VOLUNTEER' | 'ACCESSIBILITY' | 'SUSTAINABILITY';

export default function Home() {
  const { token, user, initAuth, logout } = useAuthStore();
  
  // Advanced Theme System
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Navigation & Role states
  const [workspaceActive, setWorkspaceActive] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState<RoleType>('ORGANIZER');
  const [simMode, setSimMode] = useState<SimMode>('NORMAL');
  const [activeSubTab, setActiveSubTab] = useState<'telemetry' | 'charts' | 'diagnostics'>('telemetry');
  
  const [organizerSubTab, setOrganizerSubTab] = useState<'info' | 'seats'>('seats');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [hoveredStand, setHoveredStand] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'navigation' | 'crowd' | 'transport' | 'incidents'>('navigation');

  // Security CCTV feeds simulation
  const [activeCctvCam, setActiveCctvCam] = useState<'Cam 01' | 'Cam 02' | 'Cam 03' | 'Cam 04'>('Cam 01');
  const cctvCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sustainability interactive inputs
  const [solarBoost, setSolarBoost] = useState(42);
  const [recyclingRate, setRecyclingRate] = useState(65);

  // Landing Page radar & chart animations refs
  const radarCanvasRef = useRef<HTMLCanvasElement>(null);
  const cognitiveCanvasRef = useRef<HTMLCanvasElement>(null);
  const constellationCanvasRef = useRef<HTMLCanvasElement>(null);

  // Kickoff Countdown Timer state
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 38, seconds: 7 });

  // Default logged-out behavior on first session visit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('visited_stadium');
      if (!hasVisited) {
        logout();
        sessionStorage.setItem('visited_stadium', 'true');
      } else {
        initAuth();
      }
    }
  }, [initAuth, logout]);

  // Live Countdown decrement loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Landing page background constellation network animation
  useEffect(() => {
    if (workspaceActive) return;
    const canvas = constellationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1
      });
    }

    const renderConstellation = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation lines
      ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 229, 255, 0.04)' : 'rgba(0, 87, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      ctx.fillStyle = theme === 'dark' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 87, 255, 0.15)';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(renderConstellation);
    };

    renderConstellation();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [workspaceActive, theme]);

  // Landing page Radar scan loop
  useEffect(() => {
    if (workspaceActive) return;
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const targets = [
      { x: 120, y: 70, pulse: 0 },
      { x: 60, y: 110, pulse: 2 },
      { x: 170, y: 120, pulse: 4 }
    ];

    const renderRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 87, 255, 0.15)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, 65, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 80, cy);
      ctx.lineTo(cx + 80, cy);
      ctx.moveTo(cx, cy - 80);
      ctx.lineTo(cx, cy + 80);
      ctx.stroke();

      angle += 0.02;
      ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 229, 255, 0.4)' : 'rgba(0, 87, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 75, cy + Math.sin(angle) * 75);
      ctx.stroke();

      targets.forEach((t) => {
        t.pulse += 0.08;
        const radius = 2 + (Math.sin(t.pulse) * 3);
        ctx.fillStyle = theme === 'dark' ? '#00FF88' : '#0057FF';
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius > 1 ? radius : 1, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(renderRadar);
    };

    renderRadar();
    return () => cancelAnimationFrame(animId);
  }, [workspaceActive, theme]);

  // Landing page cognitive charts loop
  useEffect(() => {
    if (workspaceActive) return;
    const canvas = cognitiveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: number[] = Array(15).fill(40);

    const renderChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.shift();
      points.push(30 + Math.random() * 35);

      ctx.beginPath();
      ctx.strokeStyle = theme === 'dark' ? '#FFB000' : '#0057FF';
      ctx.lineWidth = 2.2;

      const slice = canvas.width / (points.length - 1);
      ctx.moveTo(0, canvas.height - points[0]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(i * slice, canvas.height - points[i]);
      }
      ctx.stroke();

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 176, 0, 0.04)' : 'rgba(0, 87, 255, 0.04)';
      ctx.fill();
    };

    const interval = setInterval(renderChart, 120);
    return () => clearInterval(interval);
  }, [workspaceActive, theme]);

  // Security CCTV Camera animation loop
  useEffect(() => {
    if (!workspaceActive || selectedRole !== 'SECURITY') return;
    const canvas = cctvCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanLineY = 0;

    const renderCam = () => {
      ctx.fillStyle = '#05070D';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      for (let i = 0; i < 800; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      ctx.strokeStyle = '#00FF88';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 50, 60, 60);
      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = '#00FF88';
      ctx.fillText('PEOPLE FEED: INFLOW', 40, 45);

      if (simMode === 'EMERGENCY') {
        ctx.strokeStyle = '#FF1744';
        ctx.strokeRect(160, 80, 80, 50);
        ctx.fillStyle = '#FF1744';
        ctx.fillText('ALERT: EVACUATION BLOCKED', 160, 75);
      } else {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.strokeRect(180, 70, 70, 70);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.fillText('CROWD FLOW: OPTIMAL', 180, 65);
      }

      scanLineY += 1.2;
      if (scanLineY > canvas.height) scanLineY = 0;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.fillRect(0, scanLineY, canvas.width, 3);

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`CCTV LIVE: ${activeCctvCam} // SECURE CONCOURSE`, 10, 20);
      ctx.fillText(`FPS: 30.0 // ISO: 800`, 10, 35);
      ctx.fillStyle = '#FF1744';
      ctx.fillText('● REC', canvas.width - 45, 20);

      animId = requestAnimationFrame(renderCam);
    };

    renderCam();
    return () => cancelAnimationFrame(animId);
  }, [activeCctvCam, simMode, workspaceActive, selectedRole]);

  // Close auth modal when logged in
  useEffect(() => {
    if (token) {
      setShowAuthModal(false);
    }
  }, [token]);

  // Get metrics based on simulation mode
  const getMetrics = () => {
    switch (simMode) {
      case 'HALFTIME':
        return {
          occupancy: '74,800 / 75,000',
          occupancyPercent: 99,
          warnings: 2,
          waitTime: '12.8 Min',
          transitLoad: '4 Min',
          northDensity: 0.95,
          eastDensity: 0.98,
          southDensity: 0.96,
          westDensity: 0.97,
          aiRecommendation: 'Food courts & concourses congested. Dispatching volunteer flow guides to South Stands.',
          alerts: [
            'South Concourse retail lanes are congested.',
            'Gate 2 turnstiles reporting peak inflow limits.'
          ]
        };
      case 'EXIT':
        return {
          occupancy: '52,100 / 75,000',
          occupancyPercent: 69,
          warnings: 1,
          waitTime: '2.1 Min',
          transitLoad: '8 Min',
          northDensity: 0.45,
          eastDensity: 0.50,
          southDensity: 0.75,
          westDensity: 0.60,
          aiRecommendation: 'Egress flow active. Activating additional train frequencies at Stadium Station.',
          alerts: [
            'Metro Platform 1 reaching occupancy thresholds.',
            'Shuttle line Zone B experiencing mild highway delay.'
          ]
        };
      case 'EMERGENCY':
        return {
          occupancy: '34,200 / 75,000',
          occupancyPercent: 45,
          warnings: 5,
          waitTime: '0.2 Min',
          transitLoad: '0 Min',
          northDensity: 0.20,
          eastDensity: 0.15,
          southDensity: 0.35,
          westDensity: 0.25,
          aiRecommendation: '🚨 EMERGENCY DECLARED. Directing all remaining spectators to evacuate via Gates 1 and 4.',
          alerts: [
            '🚨 FIRE ALERT: Sector 2 East Stand. Evacuation route active.',
            'Emergency services vehicles dispatched to Gate 3.',
            'System is automatically routing fans to Gates 1 and 4.'
          ]
        };
      default:
        return {
          occupancy: '63,154 / 75,000',
          occupancyPercent: 84,
          warnings: 0,
          waitTime: '5.3 Min',
          transitLoad: '1 Min',
          northDensity: 0.70,
          eastDensity: 0.82,
          southDensity: 0.85,
          westDensity: 0.65,
          aiRecommendation: 'Normal flow rates detected. Turnstiles processing at 85 fans per minute.',
          alerts: [
            'Peak gate inflow resolved. Density stable.',
            'Metro trains operating on regular schedule.'
          ]
        };
    }
  };

  const metrics = getMetrics();

  // Seating capacity details
  const getZoneCapacityDetails = (zone: string) => {
    const cap = 9375;
    const isNormal = !['Sector 03', 'Sector 04', 'Sector 06', 'Sector 07'].includes(zone);
    
    if (isNormal) {
      const densitiesNormal = [0.92, 0.45, 0.75, 0.85, 0.35, 0.72, 0.95, 0.52];
      const name = zone.startsWith('Sector') ? zone : 'Sector 01';
      const idx = parseInt(name.replace('Sector 0', ''), 10) - 1;
      const d = densitiesNormal[isNaN(idx) ? 0 : idx];
      return {
        title: `Normal Seating (${name})`,
        total: cap,
        occupied: Math.round(cap * d),
        available: cap - Math.round(cap * d),
        description: 'General spectator seating, access to public refreshment kiosks, and standard exits.',
        status: 'General Access',
        color: '#22c55e'
      };
    }
    
    switch (zone) {
      case 'Sector 03':
        return {
          title: 'VIP Zone (Sector 03)',
          total: cap,
          occupied: Math.round(cap * 0.88),
          available: cap - Math.round(cap * 0.88),
          description: 'Premium corporate hospitality suites, private lounges, and dedicated VIP checkpoints.',
          status: 'Active Security Checkpoints',
          color: '#f97316'
        };
      case 'Sector 04':
        return {
          title: 'Media Zone (Sector 04)',
          total: cap,
          occupied: Math.round(cap * 0.75),
          available: cap - Math.round(cap * 0.75),
          description: 'Press writing stands, broadcast commentary cabins, and satellite telecast feeds.',
          status: 'Broadcasting Online',
          color: '#eab308'
        };
      case 'Sector 06':
        return {
          title: 'Accessibility Zone (Sector 06)',
          total: cap,
          occupied: Math.round(cap * 0.52),
          available: cap - Math.round(cap * 0.52),
          description: 'Step-free tactile access pathways, wheelchair bays, and volunteer assistance services.',
          status: 'Ramps Active',
          color: '#22c55e'
        };
      case 'Sector 07':
        return {
          title: 'Premium/VVIP Zone (Sector 07)',
          total: cap,
          occupied: Math.round(cap * 0.95),
          available: cap - Math.round(cap * 0.95),
          description: 'Luxury padded seating, private elevator corridors, and guest dining lounge access.',
          status: 'Fully Staffed',
          color: '#ef4444'
        };
      default:
        return {
          title: 'All Stadium Sectors',
          total: 75000,
          occupied: 63154,
          available: 11846,
          description: 'Aggregate smart venue capacity overview across all 8 sectors.',
          status: 'Operational',
          color: '#00E5FF'
        };
    }
  };

  const zoneDetails = getZoneCapacityDetails(selectedZone || 'Overall Stadium');

  const speakTelemetry = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const text = `ArenaMind Stadium OS telemetry. Total occupancy is ${metrics.occupancy}. Average wait time is ${metrics.waitTime}. Dynamic warnings counts at ${metrics.warnings}. Solar clean energy feeding ${solarBoost} kilowatts. All systems operational.`;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    } else {
      alert('Speech synthesis not supported on this browser.');
    }
  };

  const renderFloatingFootballs = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.05] dark:opacity-[0.035]">
      <div className="absolute top-[15%] left-[8%] w-10 h-10 text-[#0057FF] animate-float-slow-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5.5 5.5l3.5 3.5M15 15l3.5 3.5M18.5 5.5L15 9M9 15l-3.5 3.5" />
        </svg>
      </div>
      <div className="absolute top-[65%] left-[12%] w-12 h-12 text-[#00E5FF] animate-float-slow-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5.5 5.5l3.5 3.5M15 15l3.5 3.5M18.5 5.5L15 9M9 15l-3.5 3.5" />
        </svg>
      </div>
      <div className="absolute top-[25%] right-[10%] w-14 h-14 text-[#0057FF] animate-float-slow-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5.5 5.5l3.5 3.5M15 15l3.5 3.5M18.5 5.5L15 9M9 15l-3.5 3.5" />
        </svg>
      </div>
      <div className="absolute top-[75%] right-[15%] w-11 h-11 text-[#00E5FF] animate-float-slow-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5.5 5.5l3.5 3.5M15 15l3.5 3.5M18.5 5.5L15 9M9 15l-3.5 3.5" />
        </svg>
      </div>
    </div>
  );

  // RENDER PORTAL / LANDING SCREEN (Aegis layout matching reference)
  if (!workspaceActive) {
    return (
      <div className={`flex flex-col min-h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#05070D] text-zinc-100' : 'bg-gray-50 text-zinc-900'
      }`}>
        <CustomCursor />

        <style>{`
          @keyframes floatSlow {
            0% { transform: translateY(0px) rotate(0deg) scale(1); }
            50% { transform: translateY(-25px) rotate(180deg) scale(1.05); }
            100% { transform: translateY(0px) rotate(360deg) scale(1); }
          }
          .animate-float-slow-1 { animation: floatSlow 18s ease-in-out infinite; }
          .animate-float-slow-2 { animation: floatSlow 24s ease-in-out infinite; }
          .animate-float-slow-3 { animation: floatSlow 30s ease-in-out infinite; }
        `}</style>

        {/* Floating football animations in background */}
        {renderFloatingFootballs()}

        {/* Dynamic Background Constellation Canvas */}
        <canvas ref={constellationCanvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Floating background glows for dark mode */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-[320px] h-[320px] bg-[#0057FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
          </>
        )}

        {/* Header section */}
        <header className={`border-b backdrop-blur-md p-4 sticky top-0 z-50 transition-colors duration-300 ${
          theme === 'dark' ? 'border-zinc-800/40 bg-[#081A33]/75 text-white' : 'border-gray-200 bg-white/85 text-zinc-855'
        }`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#0057FF]/10 border border-[#0057FF]/30 flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <div>
                <span className={`text-xs font-black tracking-wider uppercase block ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>ArenaMind Stadium OS</span>
                <span className="text-[8px] text-zinc-500 uppercase font-bold block">FIFA Matchday Command Center</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                data-magnetic
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-gray-200 text-zinc-650 hover:text-zinc-900'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {token ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{user?.name}</span>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">{user?.role}</span>
                  </div>
                  <button
                    onClick={logout}
                    data-magnetic
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-gray-200 text-zinc-655 hover:text-zinc-900'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  data-magnetic
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0057FF] hover:bg-[#0057FF]/90 text-white shadow-[0_0_15px_rgba(0,87,255,0.4)] transition-all cursor-pointer"
                >
                  Login / Signup
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Hero Portal Layout */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center space-y-8 relative z-10 my-auto">
          
          {/* Main Triple Column Grid - Compact & Medium Sized */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center pt-2">
            
            {/* Left Card: DATA BEACON GATEWAY */}
            <div className={`p-5 border rounded-2xl shadow-xl transition-all duration-300 max-w-[320px] mx-auto w-full ${
              theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40 text-white' : 'bg-white/80 border-gray-200 text-zinc-800'
            }`}>
              <div className="flex items-center space-x-2 text-[#00E5FF] mb-2.5">
                <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-ping" />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[#00E5FF]">DATA BEACON GATEWAY</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Autonomous sentinel sensor arrays scanning check-in queue rates and parking density zones.
              </p>

              {/* Animated Radar Canvas */}
              <div className={`my-3.5 flex justify-center rounded-xl border p-1.5 transition-all ${
                theme === 'dark' ? 'bg-zinc-950/20 border-zinc-800/20' : 'bg-gray-50/50 border-gray-200/80'
              }`}>
                <canvas ref={radarCanvasRef} width={240} height={150} className="w-full max-w-[240px] block" />
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-400">GATE ALFA SIGNAL</span>
                  <span className="text-[#00FF88]">98% (Strong)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-400">CONCOURSE BETA</span>
                  <span className="text-[#00FF88]">85% (Connected)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-400">PARKING STANDS</span>
                  <span className="text-[#FFB000]">64% (Saturating)</span>
                </div>
              </div>
            </div>

            {/* Middle Title & Launch CTA */}
            <div className="text-center space-y-5 flex flex-col items-center max-w-[360px] mx-auto">
              <div className="flex flex-wrap justify-center gap-1.5">
                <span className="text-[7.5px] font-black uppercase tracking-wider bg-[#0057FF]/10 text-[#00E5FF] border border-[#0057FF]/20 px-2.5 py-1 rounded-full">
                  # TOURNAMENT CO-PILOT
                </span>
                <span className="text-[7.5px] font-black uppercase tracking-wider bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 px-2.5 py-1 rounded-full">
                  # TELEMETRY: ACTIVE
                </span>
                <span className="text-[7.5px] font-black uppercase tracking-wider bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-2.5 py-1 rounded-full">
                  # DIGITAL TWIN OS
                </span>
              </div>

              <div className="space-y-3.5">
                <h1 className={`text-4xl font-black tracking-tight uppercase leading-none ${
                  theme === 'dark' ? 'text-white' : 'text-zinc-900'
                }`}>
                  ARENAMIND <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0057FF] to-[#00E5FF]">STADIUM OS</span>
                </h1>

                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed font-semibold">
                  Orchestrate tournament operations with a state-of-the-art AI-powered smart stadium twin. Monitor ticketing gateways, secure concourse flows, and solar power grids instantly.
                </p>
              </div>

              {/* Main CTA */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    if (!token) {
                      setShowAuthModal(true);
                    } else {
                      setWorkspaceActive(true);
                    }
                  }}
                  data-magnetic
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0057FF] to-[#00E5FF] text-white font-extrabold text-xs uppercase tracking-widest shadow-[0_0_24px_rgba(0,87,255,0.4)] hover:scale-[1.02] transition-all flex items-center space-x-2 cursor-pointer"
                >
                  {!token && <Lock className="w-3.5 h-3.5 text-white/95" />}
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {!token && (
                  <p className="text-[8.5px] text-zinc-500 mt-2.5 font-bold uppercase tracking-wider">
                    &gt;_ Secure Authenticated System Session Required
                  </p>
                )}
              </div>
            </div>

            {/* Right Card: SYSTEM INFRASTRUCTURE */}
            <div className={`p-5 border rounded-2xl shadow-xl transition-all duration-300 max-w-[320px] mx-auto w-full ${
              theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40 text-white' : 'bg-white/80 border-gray-200 text-zinc-800'
            }`}>
              <div className="flex items-center space-x-2 text-[#FFB000] mb-2.5">
                <span className="w-1.5 h-1.5 bg-[#FFB000] rounded-full animate-ping" />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[#FFB000]">SYSTEM INFRASTRUCTURE</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Relational SQLite queries, API response latencies, and AI security threat detection node status.
              </p>

              {/* Animated Latency Canvas */}
              <div className={`my-3.5 flex justify-center rounded-xl border p-1.5 transition-all ${
                theme === 'dark' ? 'bg-zinc-950/20 border-zinc-800/20' : 'bg-gray-50/50 border-gray-200/80'
              }`}>
                <canvas ref={cognitiveCanvasRef} width={240} height={150} className="w-full max-w-[240px] block" />
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-400">MODEL ACCURACY</span>
                  <span className="text-[#00FF88]">99.88% (Stable)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-400">SECURITY COGNITION</span>
                  <span className="text-[#00E5FF]">NORMAL</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-400">SQLITE EVENT LOGS</span>
                  <span className="text-[#00FF88]">SYNCED</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Telemetry widgets bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className={`p-3.5 border rounded-2xl shadow-sm flex items-center space-x-3 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#081A33]/50 border-zinc-800/40 text-white' : 'bg-white/80 border-gray-200 text-zinc-850'
            }`}>
              <ShieldAlert className="w-5 h-5 text-[#FF1744] flex-shrink-0" />
              <div>
                <span className="text-[8px] text-zinc-500 uppercase font-bold block">Active Alerts</span>
                <span className="text-xs font-black block mt-0.5">2 Emergencies</span>
              </div>
            </div>

            <div className={`p-3.5 border rounded-2xl shadow-sm flex items-center space-x-3 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#081A33]/50 border-zinc-800/40 text-white' : 'bg-white/80 border-gray-200 text-zinc-850'
            }`}>
              <Users className="w-5 h-5 text-[#00E5FF] flex-shrink-0" />
              <div>
                <span className="text-[8px] text-zinc-500 uppercase font-bold block">Operational Capacity</span>
                <span className="text-xs font-black block mt-0.5">83.4% Occupied</span>
              </div>
            </div>

            <div className={`p-3.5 border rounded-2xl shadow-sm flex items-center space-x-3 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#081A33]/50 border-zinc-800/40 text-white' : 'bg-white/80 border-gray-200 text-zinc-850'
            }`}>
              <Clock className="w-5 h-5 text-[#0057FF] flex-shrink-0 animate-pulse" />
              <div>
                <span className="text-[8px] text-zinc-500 uppercase font-bold block">Kickoff Countdown</span>
                <span className="text-xs font-black block mt-0.5 tabular-nums">
                  {String(countdown.hours).padStart(2, '0')}:
                  {String(countdown.minutes).padStart(2, '0')}:
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className={`p-3.5 border rounded-2xl shadow-sm flex items-center space-x-3 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#081A33]/50 border-zinc-800/40 text-white' : 'bg-white/80 border-gray-200 text-zinc-850'
            }`}>
              <Gauge className="w-5 h-5 text-[#00FF88] flex-shrink-0" />
              <div>
                <span className="text-[8px] text-zinc-500 uppercase font-bold block">Sensor Latency</span>
                <span className="text-xs font-black block mt-0.5">12ms / Stable</span>
              </div>
            </div>
          </div>

        </main>

        {/* Frosted glass modal overlay for AuthCard */}
        <AnimatePresence>
          {showAuthModal && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-md w-full"
              >
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer z-50 animate-fade-in"
                  aria-label="Close form"
                >
                  <X className="w-4 h-4" />
                </button>
                <AuthCard />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // RENDER WORKSPACE (DASHBOARD)
  return (
    <div className={`flex flex-col flex-1 font-sans min-h-screen select-none overflow-x-hidden relative transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#05070D] text-zinc-100' : 'bg-gray-100 text-zinc-900'
    }`}>
      
      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(180deg) scale(1.05); }
          100% { transform: translateY(0px) rotate(360deg) scale(1); }
        }
        .animate-float-slow-1 { animation: floatSlow 18s ease-in-out infinite; }
        .animate-float-slow-2 { animation: floatSlow 24s ease-in-out infinite; }
        .animate-float-slow-3 { animation: floatSlow 30s ease-in-out infinite; }
      `}</style>

      {/* Floating football animations in background */}
      {renderFloatingFootballs()}

      {/* Background Matrix/Grid Overlay */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      )}

      {/* Physics Cursor Follower */}
      <CustomCursor />

      {/* Top Floating Glass Navigation Bar */}
      <header className={`border-b backdrop-blur-md p-4 sticky top-0 z-50 shadow-2xl transition-colors duration-300 ${
        theme === 'dark' ? 'border-zinc-800/40 bg-[#081A33]/75 text-white' : 'border-gray-200 bg-white/80 text-zinc-850'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            {/* Back to portal button */}
            <button
              onClick={() => setWorkspaceActive(false)}
              data-magnetic
              title="Return to Portal"
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-gray-200 text-zinc-650 hover:text-zinc-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#0057FF]/10 border border-[#0057FF]/30 flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div>
                <span className={`text-xs font-black tracking-wider uppercase block ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>ArenaMind Stadium OS</span>
                <span className="text-[8px] text-[#00E5FF] uppercase font-bold tracking-wider leading-none">Command Center</span>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className={`hidden lg:flex items-center space-x-4 border px-4 py-1.5 rounded-full text-xs font-semibold ${
            theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800/60 text-zinc-400' : 'bg-gray-50 border-gray-200 text-zinc-650'
          }`}>
            <span className="text-[#00FF88] animate-pulse">● LIVE</span>
            <span>FIFA WORLD CUP MATCH</span>
            <span className="text-zinc-600">|</span>
            <span>Quarter-Finals: Matchday 22</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* AI Assistant Toggle Button in Header */}
            <button
              onClick={() => setAssistantOpen(!assistantOpen)}
              data-magnetic
              title="Toggle AI Co-pilot"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-1.5 ${
                assistantOpen
                  ? 'bg-gradient-to-r from-[#0057FF] to-[#00E5FF] text-white border-[#0057FF]/40 shadow-[0_0_15px_rgba(0,87,255,0.4)]'
                  : theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    : 'bg-white border-gray-200 text-zinc-650 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline">AI Co-pilot</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              data-magnetic
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-gray-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                data-magnetic
                aria-label="View alerts"
                className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-gray-200 text-zinc-655 hover:text-zinc-900'
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
                      theme === 'dark' ? 'bg-[#081A33]/90 border-zinc-800 text-white' : 'bg-white border-gray-200 text-zinc-850'
                    }`}
                  >
                    <div className="p-3 bg-zinc-950/20 border-b border-zinc-800/20 flex justify-between items-center">
                      <span className="text-xs font-extrabold">System Threat Alerts</span>
                      <span className="text-[8px] bg-[#FF1744]/15 text-[#FF1744] border border-[#FF1744]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                        {metrics.warnings} Alerts
                      </span>
                    </div>
                    <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                      {metrics.alerts.map((alert, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-zinc-950/10 border border-zinc-800/10 text-xs leading-normal flex items-start space-x-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#FFB000] flex-shrink-0 mt-0.5" />
                          <span>{alert}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className={`flex items-center space-x-2 border px-3 py-1.5 rounded-xl ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
              <div className="w-6 h-6 rounded-full bg-[#0057FF] flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-[0_0_10px_rgba(0,87,255,0.4)]">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-[8px] text-zinc-500 uppercase font-semibold leading-none mt-1">{user?.role || 'FAN'}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                setWorkspaceActive(false);
              }}
              data-magnetic
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-gray-200 text-zinc-650 hover:text-zinc-900'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 relative z-10">
        
        {/* Global Accessibility Bar */}
        <AccessibilityPanel />

        {/* Role Selector Switched Panels */}
        <div className={`flex flex-wrap items-center gap-2 p-1.5 border rounded-2xl transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          {(['ORGANIZER', 'SECURITY', 'MEDICAL', 'VOLUNTEER', 'ACCESSIBILITY', 'SUSTAINABILITY'] as RoleType[]).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              data-magnetic
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRole === role
                  ? 'bg-gradient-to-r from-[#0057FF] to-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,87,255,0.4)]'
                  : theme === 'dark'
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                    : 'text-zinc-655 hover:text-zinc-900 hover:bg-gray-150'
              }`}
            >
              {role === 'SECURITY' ? 'Security Personnel' : role === 'MEDICAL' ? 'Medical Team' : role === 'VOLUNTEER' ? 'Volunteer Console' : role.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Live Simulation Control panel */}
        <div className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gradient-to-r from-[#0057FF]/5 to-transparent border-zinc-800/40' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#0057FF]/10">
              <Play className="w-4.5 h-4.5 text-[#00E5FF] animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-wide">Stadium Operations Simulation</h3>
              <p className="text-[10px] text-zinc-500">Inject event loads, crowd congestion, and emergency alarm states</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['NORMAL', 'HALFTIME', 'EXIT', 'EMERGENCY'] as SimMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSimMode(mode)}
                data-magnetic
                className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  simMode === mode
                    ? mode === 'EMERGENCY'
                      ? 'bg-[#FF1744] text-white shadow-[0_0_15px_rgba(255,23,68,0.4)]'
                      : 'bg-[#0057FF] text-white shadow-[0_0_15px_rgba(0,87,255,0.4)]'
                    : theme === 'dark'
                      ? 'bg-zinc-900/60 border border-zinc-800/40 text-zinc-400 hover:text-white'
                      : 'bg-[#0057FF] text-white'
                }`}
              >
                {mode === 'EMERGENCY' && <AlertTriangle className="w-3.5 h-3.5 text-white" />}
                <span>{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub Navigation tabs */}
        <div className="flex border-b border-zinc-800/60">
          {[
            { id: 'telemetry', label: 'Real-Time Telemetry' },
            { id: 'charts', label: 'Analytics Charts' },
            { id: 'diagnostics', label: 'System Diagnostics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-6 py-3 text-[10px] font-extrabold tracking-widest uppercase border-b-2 transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'border-[#0057FF] text-[#0057FF]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Telemetry tabs content based on selected role */}
        <div className="space-y-6">
          
          {activeSubTab === 'telemetry' && (
            <div className="space-y-6">
              
              {/* Organizer Role View */}
              {selectedRole === 'ORGANIZER' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className={`p-5 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Match Status</span>
                      <span className="text-lg font-black block mt-1">2nd Half // 72'</span>
                    </div>
                    <div className={`p-5 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Volunteers Active</span>
                      <span className="text-lg font-black block mt-1">142 / 150</span>
                    </div>
                    <div className={`p-5 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Gate Readiness</span>
                      <span className="text-lg font-black text-[#00FF88] block mt-1">100% OPERATIONAL</span>
                    </div>
                    <div className={`p-5 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Stadium Capacity Fill</span>
                      <span className="text-lg font-black block mt-1 tabular-nums">{metrics.occupancyPercent}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 p-6 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0057FF] mb-3">Live Stadium Hologram</h4>
                      <HologramStadium
                        northDensity={metrics.northDensity}
                        eastDensity={metrics.eastDensity}
                        southDensity={metrics.southDensity}
                        westDensity={metrics.westDensity}
                        hoveredStand={hoveredStand}
                        onStandHover={setHoveredStand}
                        theme={theme}
                        simMode={simMode}
                        selectedZone={selectedZone}
                        onZoneSelect={setSelectedZone}
                      />
                    </div>

                    <div className={`p-6 border rounded-2xl shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <div>
                        {/* Seating Management tab selector */}
                        <div className="flex justify-between items-center border-b border-zinc-800/40 pb-2 mb-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setOrganizerSubTab('seats')}
                              className={`text-[10px] font-black uppercase tracking-wider ${
                                organizerSubTab === 'seats' ? 'text-[#0057FF]' : 'text-zinc-500'
                              }`}
                            >
                              Seats Map
                            </button>
                            <span className="text-zinc-600">|</span>
                            <button
                              onClick={() => setOrganizerSubTab('info')}
                              className={`text-[10px] font-black uppercase tracking-wider ${
                                organizerSubTab === 'info' ? 'text-[#0057FF]' : 'text-zinc-500'
                              }`}
                            >
                              Telemetry
                            </button>
                          </div>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ backgroundColor: `${zoneDetails.color}15`, color: zoneDetails.color, border: `1px solid ${zoneDetails.color}30` }}>
                            {zoneDetails.status}
                          </span>
                        </div>
                        
                        {organizerSubTab === 'info' ? (
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] font-bold text-zinc-400 uppercase block">{zoneDetails.title}</span>
                              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{zoneDetails.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div className="p-2.5 rounded-xl bg-zinc-950/20 border border-zinc-800/25">
                                <span className="text-[8px] text-zinc-500 uppercase font-bold block">Capacity</span>
                                <span className="text-xs font-extrabold block mt-0.5">{zoneDetails.total.toLocaleString()} Seats</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-zinc-950/20 border border-zinc-800/25">
                                <span className="text-[8px] text-zinc-500 uppercase font-bold block">Occupied</span>
                                <span className="text-xs font-extrabold block mt-0.5">{zoneDetails.occupied.toLocaleString()} Seats</span>
                              </div>
                            </div>

                            <div className="space-y-2 text-xs pt-1">
                              <div className="flex justify-between text-zinc-400">
                                <span>Available Seats:</span>
                                <span className="font-bold text-white">{zoneDetails.available.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-zinc-400">
                                <span>Occupancy Rate:</span>
                                <span className="font-bold text-[#00FF88]">{Math.round((zoneDetails.occupied / zoneDetails.total) * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // SEATING ALLOCATION AND DETAILS
                          <div className="space-y-3 text-xs text-left">
                            <div className="flex justify-between items-center bg-zinc-950/25 p-2 rounded-xl border border-zinc-850">
                              <div>
                                <span className="font-extrabold text-white">General Admission</span>
                                <p className="text-[8px] text-zinc-500">Public viewing (60k total)</p>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-[#00FF88]">51,200</span>
                                <span className="text-[8px] text-zinc-500"> / 60k</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-zinc-950/25 p-2 rounded-xl border border-zinc-850">
                              <div>
                                <span className="font-extrabold text-white">VIP Club Seats</span>
                                <p className="text-[8px] text-zinc-500">Hospitality boxes (8k total)</p>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-[#FFB000]">7,040</span>
                                <span className="text-[8px] text-zinc-500"> / 8k</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-zinc-950/25 p-2 rounded-xl border border-zinc-850">
                              <div>
                                <span className="font-extrabold text-white">VVIP / Premium</span>
                                <p className="text-[8px] text-zinc-500">Luxury suites (3k total)</p>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-[#FF1744]">2,850</span>
                                <span className="text-[8px] text-zinc-500"> / 3k</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-zinc-950/25 p-2 rounded-xl border border-zinc-850">
                              <div>
                                <span className="font-extrabold text-white">Media Sector Desk</span>
                                <p className="text-[8px] text-zinc-500">Broadcaster desk (2k total)</p>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-[#00E5FF]">1,500</span>
                                <span className="text-[8px] text-zinc-500"> / 2k</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-zinc-950/25 p-2 rounded-xl border border-zinc-850">
                              <div>
                                <span className="font-extrabold text-white">Accessibility Bays</span>
                                <p className="text-[8px] text-zinc-500">Wheelchair step-free (2k total)</p>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-[#00FF88]">1,040</span>
                                <span className="text-[8px] text-zinc-500"> / 2k</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-zinc-800/40">
                        <span className="text-[9px] text-[#00E5FF] font-bold uppercase tracking-wider block">AI Crowd Dispatch Advice</span>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">
                          {selectedZone 
                            ? `Flow rates in ${selectedZone} are steady. Maintain active gate personnel routing.` 
                            : 'Spectator queues are building at Gate A. AI recommends redirecting overflow check-ins to Gate C.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Role View */}
              {selectedRole === 'SECURITY' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 p-6 border rounded-2xl shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF1744]">AI CCTV Threat Feed</h4>
                            <p className="text-[10px] text-zinc-500">Live target tracking and face recognition camera feeds.</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {['Cam 01', 'Cam 02', 'Cam 03', 'Cam 04'].map((cam) => (
                              <button
                                key={cam}
                                onClick={() => setActiveCctvCam(cam as any)}
                                className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                                  activeCctvCam === cam ? 'bg-[#FF1744] text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                                }`}
                              >
                                {cam}
                              </button>
                            ))}
                          </div>
                        </div>
                        <canvas ref={cctvCanvasRef} width={640} height={320} className="w-full h-80 rounded-xl block border border-zinc-800/40 shadow-inner" />
                      </div>
                    </div>

                    <div className={`p-6 border rounded-2xl shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF1744] mb-3">Security Incidents Logs</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          <div className="p-3 rounded-lg bg-zinc-950/20 border border-zinc-800/30 text-xs">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-[#FFB000]">Sector 102 Congestion</span>
                              <span className="text-[9px] uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">DISPATCHED</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Volunteers dispatched to clear retail lane corridors.</p>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-950/20 border border-zinc-800/30 text-xs">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-[#FF1744]">SOS Ticket Turnstile 4</span>
                              <span className="text-[9px] uppercase bg-[#FF1744]/15 border border-[#FF1744]/30 px-2 py-0.5 rounded text-[#FF1744]">REPORTED</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Fan reported gate scanning system failure. Medical responder en route.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-zinc-800/40">
                        <IncidentPanel />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Role View */}
              {selectedRole === 'MEDICAL' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 p-6 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] mb-3">Ambulance Dispatch Control</h4>
                      <div className="space-y-3">
                        <div className="p-3 border border-zinc-850 rounded-xl bg-zinc-900/40 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-zinc-350">Ambulance Unit 01 // Gate 3 Entry</p>
                            <span className="text-[9px] text-zinc-500 uppercase font-semibold">Triage Priority: High</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#FF1744]/10 border border-[#FF1744]/20 text-[#FF1744] font-extrabold text-[10px]">
                            Dispatched
                          </span>
                        </div>
                        <div className="p-3 border border-zinc-850 rounded-xl bg-zinc-900/40 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-zinc-350">Ambulance Unit 02 // Sector B Parking</p>
                            <span className="text-[9px] text-zinc-500 uppercase font-semibold">Triage Priority: Minor</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-extrabold text-[10px]">
                            Idle / Ready
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 border rounded-2xl shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] mb-3">Triage Patient Logs</h4>
                        <ul className="space-y-3 text-xs leading-normal">
                          <li className="p-2.5 bg-zinc-950/20 border border-zinc-800/20 rounded-lg">
                            <span className="font-bold text-white">Patient #4102</span>
                            <p className="text-[10px] text-zinc-400">Heat exhaustion, sector 105. Fluids administered. Recovering.</p>
                          </li>
                          <li className="p-2.5 bg-zinc-950/20 border border-zinc-800/20 rounded-lg">
                            <span className="font-bold text-white">Patient #4103</span>
                            <p className="text-[10px] text-zinc-400">Minor ankle sprain at Concourse Gate A. Bandaged.</p>
                          </li>
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-zinc-800/40 text-[10px] text-zinc-500">
                        <span>● Connected Hospital: St. Jude Medical Emergency Hub</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Volunteer Role View */}
              {selectedRole === 'VOLUNTEER' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 p-6 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0057FF] mb-3">Shift Assignments Checklist</h4>
                      <ul className="space-y-3 text-xs">
                        <li className="p-3 border border-zinc-850 rounded-xl bg-zinc-900/40 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white">Direct spectators at Gate B</span>
                            <p className="text-[9px] text-zinc-500">Ensure queue wait times remain under 6 minutes.</p>
                          </div>
                          <span className="text-[10px] font-bold text-[#00FF88]">COMPLETED</span>
                        </li>
                        <li className="p-3 border border-zinc-850 rounded-xl bg-zinc-900/40 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white">Coordinate accessibility ramp routing</span>
                            <p className="text-[9px] text-zinc-500">Assist wheelchair arrivals at West Concourse.</p>
                          </div>
                          <span className="text-[10px] font-bold text-warning">IN PROGRESS</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`p-6 border rounded-2xl shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0057FF] mb-3">Broadcast Center</h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">
                          Organizers sent a global broadcast channel: "Halftime crowds exiting to concessions. Secure all exits."
                        </p>
                        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0057FF] to-[#00E5FF] text-white font-extrabold text-xs cursor-pointer shadow-md">
                          Clock-in shift
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Accessibility Role View */}
              {selectedRole === 'ACCESSIBILITY' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 p-6 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] mb-3">Tactile wheelchair routes</h4>
                      <div className="space-y-3 text-xs leading-normal">
                        <div className="p-3 bg-zinc-950/20 border border-zinc-800/20 rounded-xl">
                          <span className="font-bold text-white">Elevator Sector 108</span>
                          <p className="text-[10px] text-zinc-500">Fully operational. Connecting level 0 concourse to level 1 seats.</p>
                        </div>
                        <div className="p-3 bg-zinc-950/20 border border-zinc-800/20 rounded-xl">
                          <span className="font-bold text-white">Tactile Pathway Gate 4</span>
                          <p className="text-[10px] text-zinc-500">Induction loop sensor active. Visual signs routing active.</p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 border rounded-2xl shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] mb-3">Voice synthesis guidance</h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">
                          Activate our accessibility speech engine to read the stadium status aloud using HTML5 synthesis.
                        </p>
                        <button
                          onClick={speakTelemetry}
                          className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-350 hover:text-white font-extrabold text-xs cursor-pointer flex items-center justify-center space-x-2"
                        >
                          <Volume2 className="w-4 h-4 text-[#00E5FF]" />
                          <span>Speak live telemetry</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sustainability Role View */}
              {selectedRole === 'SUSTAINABILITY' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 p-6 border rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#00FF88] mb-3">Solar Grid Generation</h4>
                      <div className="p-4 rounded-xl bg-zinc-950/20 border border-zinc-800/30 space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>Solar array output</span>
                            <span className="text-[#00FF88]">{solarBoost} kW</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="120"
                            value={solarBoost}
                            onChange={(e) => setSolarBoost(parseInt(e.target.value))}
                            className="w-full accent-[#00FF88]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>Waste diversion rate</span>
                            <span className="text-[#00FF88]">{recyclingRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="95"
                            value={recyclingRate}
                            onChange={(e) => setRecyclingRate(parseInt(e.target.value))}
                            className="w-full accent-[#00FF88]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 border rounded-2xl shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200'}`}>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#00FF88] mb-3">Green Stadium score</h4>
                        <div className="text-center py-4">
                          <span className="text-4xl font-black">{Math.round((solarBoost * 0.4) + (recyclingRate * 0.6))}</span>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Ecomark rating</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-zinc-800/40 text-[10px] text-zinc-500">
                        <span>● Solar panel status: ONLINE</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom detail panels */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500">Operational sub consoles</h4>
                <div className="flex border-b border-zinc-800/60 overflow-x-auto">
                  {[
                    { id: 'navigation', label: 'Navigation Routing Map', icon: Compass },
                    { id: 'crowd', label: 'Crowd Flow Forecast', icon: Users },
                    { id: 'transport', label: 'Transit & Shuttle Control', icon: Truck },
                    { id: 'incidents', label: 'SOS Emergency & Incidents', icon: ShieldAlert }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDetailsTab(tab.id as any)}
                      data-magnetic
                      className={`flex items-center space-x-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeDetailsTab === tab.id
                          ? 'border-[#0057FF] text-[#0057FF]'
                          : 'border-transparent text-zinc-500 hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-2 border border-zinc-800/20 rounded-xl bg-zinc-950/10">
                  {activeDetailsTab === 'navigation' && <NavigationPanel />}
                  {activeDetailsTab === 'crowd' && <CrowdPanel />}
                  {activeDetailsTab === 'transport' && <TransportPanel />}
                  {activeDetailsTab === 'incidents' && <IncidentPanel />}
                </div>
              </div>

            </div>
          )}

          {activeSubTab === 'charts' && (
            <div className={`p-8 border rounded-2xl shadow-xl text-center space-y-6 ${
              theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <TrendingUp className="w-12 h-12 mx-auto text-[#0057FF] animate-bounce" />
              <h3 className="text-base font-bold">Flow Speeds Analytics Graphs</h3>
              
              <div className="flex justify-center items-end space-x-6 h-40 max-w-sm mx-auto pt-4">
                {[
                  { label: 'Gate A', val: simMode === 'NORMAL' ? 45 : simMode === 'HALFTIME' ? 85 : simMode === 'EXIT' ? 95 : 10 },
                  { label: 'Gate B', val: simMode === 'NORMAL' ? 55 : simMode === 'HALFTIME' ? 90 : simMode === 'EXIT' ? 80 : 15 },
                  { label: 'Gate C', val: simMode === 'NORMAL' ? 40 : simMode === 'HALFTIME' ? 75 : simMode === 'EXIT' ? 60 : 12 },
                  { label: 'Gate D', val: simMode === 'NORMAL' ? 65 : simMode === 'HALFTIME' ? 95 : simMode === 'EXIT' ? 85 : 8 },
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-10 rounded-t-lg bg-gradient-to-t from-[#0057FF] to-[#00E5FF] transition-all duration-500 shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                      style={{ height: `${bar.val}%` }}
                    />
                    <span className="text-[10px] text-zinc-500 font-bold mt-2">{bar.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                Real-time crowd entrance rates peaked at **85 turnstile counts per minute** during gate ingress. 
                Metro transit flow maintains an optimal throughput level of **1,420 passengers per hour**.
              </p>
            </div>
          )}

          {activeSubTab === 'diagnostics' && (
            <div className={`p-8 border rounded-2xl shadow-xl text-center space-y-6 ${
              theme === 'dark' ? 'bg-[#081A33]/70 border-zinc-800/40' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <Gauge className="w-12 h-12 mx-auto text-[#00E5FF] animate-spin-slow" />
              <h3 className="text-base font-bold">Smart Stadium Infrastructure Diagnostics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left pt-2">
                <div className="p-3 border border-zinc-800/20 bg-zinc-950/20 rounded-xl text-xs">
                  <span className="text-[8px] text-zinc-500 block">SQLite Latency</span>
                  <span className="font-extrabold text-[#00FF88] block mt-0.5">0.4ms (Healthy)</span>
                </div>
                <div className="p-3 border border-zinc-800/20 bg-zinc-950/20 rounded-xl text-xs">
                  <span className="text-[8px] text-zinc-500 block">NestJS API Status</span>
                  <span className="font-extrabold text-[#00FF88] block mt-0.5">Online // Ping: 12ms</span>
                </div>
                <div className="p-3 border border-zinc-800/20 bg-zinc-950/20 rounded-xl text-xs">
                  <span className="text-[8px] text-zinc-500 block">Active CCTV Nodes</span>
                  <span className="font-extrabold text-[#00FF88] block mt-0.5">142/142 connected</span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                Smart Stadium OS telemetry indicates safe operating conditions. CPU Load: **42%**. 
                Relational SQLite DB matches all schema requirements.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Sparkles AI Assistant Button (Bottom-Right co-pilot) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAssistantOpen(!assistantOpen)}
          data-magnetic
          aria-label="Toggle AI assistant panel"
          className="p-4 rounded-full bg-gradient-to-r from-[#0057FF] to-[#00E5FF] text-white shadow-[0_0_20px_rgba(0,87,255,0.5)] flex items-center justify-center cursor-pointer border border-[#0057FF]/40 hover:brightness-110 transition-all"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </motion.button>

        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className={`absolute bottom-18 right-0 w-[420px] border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl ${
                theme === 'dark' ? 'bg-[#081A33]/90 border-zinc-800/80 text-white' : 'bg-white border-gray-200 text-zinc-800'
              }`}
            >
              <ChatPanel onClose={() => setAssistantOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
