'use client';

import React, { useEffect, useRef } from 'react';

export const HologramFootball: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = parentElementWidth(canvas);
    let height = canvas.height = 420;

    function parentElementWidth(el: HTMLElement): number {
      return el.parentElement ? el.parentElement.clientWidth : 600;
    }

    const handleResize = () => {
      width = canvas.width = parentElementWidth(canvas);
      height = canvas.height = 420;
    };

    window.addEventListener('resize', handleResize);

    // Golden ratio for icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const scale = 110;

    // Define 12 vertices of an icosahedron
    const rawVertices = [
      { x: -1, y:  phi, z:  0 },
      { x:  1, y:  phi, z:  0 },
      { x: -1, y: -phi, z:  0 },
      { x:  1, y: -phi, z:  0 },
      { x:  0, y: -1, z:  phi },
      { x:  0, y:  1, z:  phi },
      { x:  0, y: -1, z: -phi },
      { x:  0, y:  1, z: -phi },
      { x:  phi, y:  0, z: -1 },
      { x:  phi, y:  0, z:  1 },
      { x: -phi, y:  0, z: -1 },
      { x: -phi, y:  0, z:  1 },
    ];

    // Normalize vertices to make a perfect sphere
    const vertices = rawVertices.map((v) => {
      const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      return {
        x: (v.x / len) * scale,
        y: (v.y / len) * scale,
        z: (v.z / len) * scale,
      };
    });

    // Subdivide edges to get a beautiful geodesic soccer ball pattern (truncated icosahedron style)
    // For simplicity and high visual aesthetic, we draw the icosahedron edges and add sub-segments
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i].x - vertices[j].x;
        const dy = vertices[i].y - vertices[j].y;
        const dz = vertices[i].z - vertices[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Icosahedron edge distance threshold
        if (dist < scale * 1.1) {
          edges.push([i, j]);
        }
      }
    }

    // Create orbiting satellite particles
    const satellites: { x: number; y: number; z: number; angle: number; speed: number; radius: number }[] = [];
    for (let i = 0; i < 30; i++) {
      satellites.push({
        x: 0, y: 0, z: 0,
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.015,
        radius: 140 + Math.random() * 40,
      });
    }

    // Handle mouse rotation influence
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Map displacement to angle influence
      targetRotation.current.y = ((e.clientX - cx) / rect.width) * Math.PI * 0.6;
      targetRotation.current.x = -((e.clientY - cy) / rect.height) * Math.PI * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const fov = 400;
    const distance = 400;

    const project = (x: number, y: number, z: number) => {
      const zoom = fov / (z + distance);
      return {
        x: width / 2 + x * zoom,
        y: height / 2 + y * zoom,
        depth: z,
      };
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate rotation towards target
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.06;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.06;

      // Base auto spin
      rotation.current.y += 0.005;

      const cosX = Math.cos(rotation.current.x);
      const sinX = Math.sin(rotation.current.x);
      const cosY = Math.cos(rotation.current.y);
      const sinY = Math.sin(rotation.current.y);

      const transform = (v: { x: number; y: number; z: number }) => {
        // Rotate Y
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.x * sinY + v.z * cosY;
        // Rotate X
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = v.y * sinX + z1 * cosX;
        return { x: x1, y: y2, z: z2 };
      };

      const renderQueue: { depth: number; draw: () => void }[] = [];

      // 1. Draw Football Panel Grid
      const transformedVerts = vertices.map((v) => transform(v));

      edges.forEach(([i, j]) => {
        const v1 = transformedVerts[i];
        const v2 = transformedVerts[j];
        const depth = (v1.z + v2.z) / 2;

        renderQueue.push({
          depth,
          draw: () => {
            const pt1 = project(v1.x, v1.y, v1.z);
            const pt2 = project(v2.x, v2.y, v2.z);

            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'; // Cyan neon edge
            ctx.lineWidth = v1.z > 0 && v2.z > 0 ? 1 : 2;
            ctx.stroke();

            // Draw center node of panels (simulating soccer hexagons)
            const cx = (pt1.x + pt2.x) / 2;
            const cy = (pt1.y + pt2.y) / 2;
            ctx.beginPath();
            ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#00FF88'; // Green node
            ctx.fill();
          },
        });
      });

      // 2. Satellites
      satellites.forEach((sat, idx) => {
        sat.angle += sat.speed;
        const x_raw = Math.cos(sat.angle) * sat.radius;
        const z_raw = Math.sin(sat.angle) * sat.radius;
        const y_raw = Math.sin(sat.angle + idx) * 30; // Tilt orbit

        const trans = transform({ x: x_raw, y: y_raw, z: z_raw });
        const depth = trans.z;

        renderQueue.push({
          depth,
          draw: () => {
            const pt = project(trans.x, trans.y, trans.z);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#00E5FF';
            ctx.fill();

            // Tiny orbit trails
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, sat.radius * (fov / (trans.z + distance)), 0, Math.PI * 2);
            ctx.stroke();
          },
        });
      });

      // Sort & Draw
      renderQueue.sort((a, b) => b.depth - a.depth);
      renderQueue.forEach((item) => item.draw());

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center relative">
      <canvas ref={canvasRef} className="block relative z-10 w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-[#05070D] pointer-events-none z-20" />
    </div>
  );
});

HologramFootball.displayName = 'HologramFootball';
