'use client';

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  // Mouse coords
  const mouse = useRef({ x: 0, y: 0 });
  // Spring cursor coords
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

  const [active, setActive] = useState(false);
  const [magneticElement, setMagneticElement] = useState<Element | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setActive(true);
    };

    const handleMouseLeave = () => {
      setActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Scan for magnetic elements to attract to
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const mag = target.closest('[data-magnetic]');
      if (mag) {
        setMagneticElement(mag);
      } else {
        setMagneticElement(null);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    // Spring animation loop
    const updateCursor = () => {
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;

      if (magneticElement && ringRef.current) {
        const rect = magneticElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Stronger pull close to the center
        targetX = centerX + (mouse.current.x - centerX) * 0.35;
        targetY = centerY + (mouse.current.y - centerY) * 0.35;
      }

      // Spring physics
      const stiffness = 0.12;
      const damping = 0.65;

      const dx = targetX - pos.current.x;
      const dy = targetY - pos.current.y;

      vel.current.x += dx * stiffness;
      vel.current.y += dy * stiffness;

      vel.current.x *= damping;
      vel.current.y *= damping;

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x - 4}px, ${mouse.current.y - 4}px, 0)`;
        
        if (magneticElement) {
          const rect = magneticElement.getBoundingClientRect();
          ringRef.current.style.width = `${rect.width + 12}px`;
          ringRef.current.style.height = `${rect.height + 12}px`;
          ringRef.current.style.borderRadius = '16px';
          ringRef.current.style.transform = `translate3d(${rect.left - 6}px, ${rect.top - 6}px, 0)`;
          ringRef.current.style.borderColor = 'rgba(124, 58, 237, 0.8)';
          ringRef.current.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
          ringRef.current.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.3)';
        } else {
          ringRef.current.style.width = '32px';
          ringRef.current.style.height = '32px';
          ringRef.current.style.borderRadius = '50%';
          ringRef.current.style.transform = `translate3d(${pos.current.x - 16}px, ${pos.current.y - 16}px, 0)`;
          ringRef.current.style.borderColor = 'rgba(6, 182, 212, 0.6)';
          ringRef.current.style.backgroundColor = 'transparent';
          ringRef.current.style.boxShadow = 'none';
        }
      }

      requestRef.current = requestAnimationFrame(updateCursor);
    };

    requestRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [magneticElement]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      {/* Small dot follower */}
      <div
        ref={cursorRef}
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] transition-transform duration-75 ease-out"
      />
      {/* Outer physics-based fluid ring */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 border border-cyan-400/50 pointer-events-none transition-[width,height,border-radius,background-color,border-color,box-shadow] duration-300 ease-out"
        style={{ width: '32px', height: '32px', borderRadius: '50%' }}
      />
    </div>
  );
};
