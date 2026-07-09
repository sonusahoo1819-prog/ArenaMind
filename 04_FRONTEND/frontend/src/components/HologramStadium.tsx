'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface HologramStadiumProps {
  northDensity: number;
  eastDensity: number;
  southDensity: number;
  westDensity: number;
  hoveredStand: string | null;
  onStandHover: (stand: string | null) => void;
  theme: 'dark' | 'light';
  simMode: 'NORMAL' | 'HALFTIME' | 'EXIT' | 'EMERGENCY';
  selectedZone: string | null;
  onZoneSelect: (zone: string | null) => void;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
}

export const HologramStadium: React.FC<HologramStadiumProps> = ({
  hoveredStand,
  onStandHover,
  theme,
  simMode,
  selectedZone,
  onZoneSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationAngle = useRef(0.2);
  const mousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  
  // Interactive 3D view states
  const [zoom, setZoom] = useState(1.05);
  const [tilt, setTilt] = useState(0.32); // Vaulted pitch angle for open-air overview
  const [autoRotate, setAutoRotate] = useState(true);

  // Dynamic densities for 8 sectors
  const getSectorDensity = (name: string): number => {
    const index = parseInt(name.replace('Sector 0', ''), 10) - 1;
    if (isNaN(index)) return 0.5;

    if (simMode === 'EMERGENCY') {
      return 0.25; // Evacuating
    }

    const densitiesNormal = [0.92, 0.45, 0.75, 0.85, 0.35, 0.72, 0.95, 0.52];
    const densitiesHalftime = [0.98, 0.88, 0.95, 0.96, 0.78, 0.92, 0.97, 0.85];
    const densitiesExit = [0.45, 0.35, 0.52, 0.62, 0.25, 0.48, 0.55, 0.32];
    
    if (simMode === 'HALFTIME') return densitiesHalftime[index];
    if (simMode === 'EXIT') return densitiesExit[index];
    return densitiesNormal[index];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width;
    let height = canvas.height;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = canvas.width = parent.clientWidth;
        height = canvas.height = 420; // Increased height for grander scale
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 3D projection parameters
    const fov = 400;
    const cameraDistance = 520;

    // Pitch dimensions (Larger & wider)
    const pitchWidth = 190;
    const pitchLength = 135;

    // Define 8 equal open-air stadium stands with multi-tier seating rows
    const createStands = (): { stand: string; polygons: Point3D[][]; tierType: 'lower' | 'upper' }[] => {
      const standsData: { stand: string; polygons: Point3D[][]; tierType: 'lower' | 'upper' }[] = [];
      const sectorsCount = 8;

      const baseRadiusX = 140;
      const baseRadiusZ = 105;

      for (let i = 0; i < sectorsCount; i++) {
        const lowerPolys: Point3D[][] = [];
        const upperPolys: Point3D[][] = [];
        
        const startAngle = -Math.PI + (i / sectorsCount) * Math.PI * 2;
        const endAngle = -Math.PI + ((i + 1) / sectorsCount) * Math.PI * 2;
        const name = `Sector 0${i + 1}`;

        // 1. Lower Tier Seating
        const lowerLayers = 3;
        for (let l = 0; l < lowerLayers; l++) {
          const innerRadX = baseRadiusX + l * 12;
          const innerRadZ = baseRadiusZ + l * 10;
          const outerRadX = baseRadiusX + (l + 1) * 12;
          const outerRadZ = baseRadiusZ + (l + 1) * 10;
          const h1 = -15 - l * 5;
          const h2 = -15 - (l + 1) * 5;

          const steps = 6;
          for (let s = 0; s < steps; s++) {
            const a1 = startAngle + (s / steps) * (endAngle - startAngle);
            const a2 = startAngle + ((s + 1) / steps) * (endAngle - startAngle);

            const p1 = { x: Math.cos(a1) * innerRadX, y: h1, z: Math.sin(a1) * innerRadZ };
            const p2 = { x: Math.cos(a2) * innerRadX, y: h1, z: Math.sin(a2) * innerRadZ };
            const p3 = { x: Math.cos(a2) * outerRadX, y: h2, z: Math.sin(a2) * outerRadZ };
            const p4 = { x: Math.cos(a1) * outerRadX, y: h2, z: Math.sin(a1) * outerRadZ };

            lowerPolys.push([p1, p2, p3, p4]);
          }
        }

        // 2. Upper Tier Seating (Spans wider with a concourse gap)
        const upperLayers = 3;
        const concourseOffset = 18;
        const upperBaseRadiusX = baseRadiusX + (lowerLayers * 12) + concourseOffset;
        const upperBaseRadiusZ = baseRadiusZ + (lowerLayers * 10) + concourseOffset;
        
        for (let l = 0; l < upperLayers; l++) {
          const innerRadX = upperBaseRadiusX + l * 14;
          const innerRadZ = upperBaseRadiusZ + l * 12;
          const outerRadX = upperBaseRadiusX + (l + 1) * 14;
          const outerRadZ = upperBaseRadiusZ + (l + 1) * 12;
          const h1 = -38 - l * 7;
          const h2 = -38 - (l + 1) * 7;

          const steps = 6;
          for (let s = 0; s < steps; s++) {
            const a1 = startAngle + (s / steps) * (endAngle - startAngle);
            const a2 = startAngle + ((s + 1) / steps) * (endAngle - startAngle);

            const p1 = { x: Math.cos(a1) * innerRadX, y: h1, z: Math.sin(a1) * innerRadZ };
            const p2 = { x: Math.cos(a2) * innerRadX, y: h1, z: Math.sin(a2) * innerRadZ };
            const p3 = { x: Math.cos(a2) * outerRadX, y: h2, z: Math.sin(a2) * outerRadZ };
            const p4 = { x: Math.cos(a1) * outerRadX, y: h2, z: Math.sin(a1) * outerRadZ };

            upperPolys.push([p1, p2, p3, p4]);
          }
        }

        standsData.push({ stand: name, polygons: lowerPolys, tierType: 'lower' });
        standsData.push({ stand: name, polygons: upperPolys, tierType: 'upper' });
      }

      return standsData;
    };

    const stands = createStands();

    // Fan particles streams
    const particles: Point3D[] = [];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = 145 + Math.random() * 90;
      const radiusZ = radiusX * 0.72;
      particles.push({
        x: Math.cos(angle) * radiusX,
        y: -10 - Math.random() * 40,
        z: Math.sin(angle) * radiusZ,
        size: Math.random() * 1.6 + 1,
      });
    }

    // 3D rotations math
    const rotateY = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos - point.z * sin,
        y: point.y,
        z: point.x * sin + point.z * cos,
      };
    };

    const rotateX = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
      };
    };

    const project = (point: Point3D) => {
      const adjustedFOV = fov * zoom;
      const scale = adjustedFOV / (point.z + cameraDistance);
      return {
        x: width / 2 + point.x * scale,
        y: height / 2 + point.y * scale,
        depth: point.z,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      setAutoRotate(false); // Disable auto rotation while manual drag is active
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;

      if (isDragging.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        rotationAngle.current += deltaX * 0.008;
        setTilt((prev) => Math.max(0.12, Math.min(0.85, prev - deltaY * 0.005)));

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUpOrLeave = () => {
      isDragging.current = false;
    };

    const handleMouseClick = () => {
      if (hoveredStand && !isDragging.current) {
        onZoneSelect(hoveredStand === selectedZone ? null : hoveredStand);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUpOrLeave);
    canvas.addEventListener('mouseleave', handleMouseUpOrLeave);
    canvas.addEventListener('click', handleMouseClick);

    // Animation loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Open sky backdrop gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (theme === 'dark') {
        skyGrad.addColorStop(0, '#020408');
        skyGrad.addColorStop(1, '#05070D');
      } else {
        skyGrad.addColorStop(0, '#EAF2F8');
        skyGrad.addColorStop(1, '#F9FAFB');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      if (autoRotate) {
        rotationAngle.current += 0.002;
      }

      const renderQueue: { depth: number; draw: () => void }[] = [];

      // 1. RENDER 3D FOOTBALL PITCH (Green grass & markings)
      const pitchCorners = [
        { x: -pitchWidth / 2, y: 0, z: -pitchLength / 2 },
        { x: pitchWidth / 2, y: 0, z: -pitchLength / 2 },
        { x: pitchWidth / 2, y: 0, z: pitchLength / 2 },
        { x: -pitchWidth / 2, y: 0, z: pitchLength / 2 }
      ].map(pt => project(rotateX(rotateY(pt, rotationAngle.current), tilt)));

      const pitchDepth = pitchCorners.reduce((sum, pt) => sum + pt.depth, 0) / 4;

      renderQueue.push({
        depth: pitchDepth + 30, // Bottom-most
        draw: () => {
          ctx.beginPath();
          ctx.moveTo(pitchCorners[0].x, pitchCorners[0].y);
          for (let i = 1; i < pitchCorners.length; i++) {
            ctx.lineTo(pitchCorners[i].x, pitchCorners[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = theme === 'dark' ? '#092410' : '#2A7A2E';
          ctx.fill();
          ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.75)';
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Center circle
          const centerCirclePoints: Point3D[] = [];
          const radius = 28;
          for (let a = 0; a <= Math.PI * 2; a += Math.PI / 16) {
            centerCirclePoints.push({ x: Math.cos(a) * radius, y: 0, z: Math.sin(a) * radius });
          }
          const projectedCircle = centerCirclePoints.map(pt => project(rotateX(rotateY(pt, rotationAngle.current), tilt)));
          ctx.beginPath();
          ctx.moveTo(projectedCircle[0].x, projectedCircle[0].y);
          for (let i = 1; i < projectedCircle.length; i++) {
            ctx.lineTo(projectedCircle[i].x, projectedCircle[i].y);
          }
          ctx.closePath();
          ctx.stroke();

          // Center line
          const centerLine = [
            { x: 0, y: 0, z: -pitchLength / 2 },
            { x: 0, y: 0, z: pitchLength / 2 }
          ].map(pt => project(rotateX(rotateY(pt, rotationAngle.current), tilt)));
          ctx.beginPath();
          ctx.moveTo(centerLine[0].x, centerLine[0].y);
          ctx.lineTo(centerLine[1].x, centerLine[1].y);
          ctx.stroke();

          // Penalty Areas
          const drawPenaltyArea = (zSign: number) => {
            const boxWidth = 65;
            const boxLength = 26;
            const pts = [
              { x: -boxWidth / 2, y: 0, z: zSign * (pitchLength / 2) },
              { x: -boxWidth / 2, y: 0, z: zSign * (pitchLength / 2 - boxLength) },
              { x: boxWidth / 2, y: 0, z: zSign * (pitchLength / 2 - boxLength) },
              { x: boxWidth / 2, y: 0, z: zSign * (pitchLength / 2) }
            ].map(pt => project(rotateX(rotateY(pt, rotationAngle.current), tilt)));
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.lineTo(pts[1].x, pts[1].y);
            ctx.lineTo(pts[2].x, pts[2].y);
            ctx.lineTo(pts[3].x, pts[3].y);
            ctx.stroke();
          };
          drawPenaltyArea(1);
          drawPenaltyArea(-1);

          // Goal posts net outline
          const drawGoal = (zSign: number) => {
            const goalW = 20;
            const goalH = -8;
            const goalZ = zSign * (pitchLength / 2);
            const pts = [
              { x: -goalW / 2, y: 0, z: goalZ },
              { x: -goalW / 2, y: goalH, z: goalZ },
              { x: goalW / 2, y: goalH, z: goalZ },
              { x: goalW / 2, y: 0, z: goalZ },
              { x: goalW / 2, y: 0, z: goalZ + zSign * 6 },
              { x: goalW / 2, y: goalH, z: goalZ + zSign * 6 },
              { x: -goalW / 2, y: goalH, z: goalZ + zSign * 6 },
              { x: -goalW / 2, y: 0, z: goalZ + zSign * 6 }
            ].map(pt => project(rotateX(rotateY(pt, rotationAngle.current), tilt)));

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.lineTo(pts[1].x, pts[1].y);
            ctx.lineTo(pts[2].x, pts[2].y);
            ctx.lineTo(pts[3].x, pts[3].y);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.0;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pts[1].x, pts[1].y);
            ctx.lineTo(pts[6].x, pts[6].y);
            ctx.lineTo(pts[7].x, pts[7].y);
            ctx.moveTo(pts[2].x, pts[2].y);
            ctx.lineTo(pts[5].x, pts[5].y);
            ctx.lineTo(pts[4].x, pts[4].y);
            ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 1.0;
            ctx.stroke();
          };
          drawGoal(1);
          drawGoal(-1);

          // Technical Player Zones (Benches)
          const drawPlayerBench = (xOffset: number) => {
            const benchW = 18;
            const benchH = 6;
            const pts = [
              { x: xOffset - benchW / 2, y: 0, z: pitchLength / 2 + 8 },
              { x: xOffset + benchW / 2, y: 0, z: pitchLength / 2 + 8 },
              { x: xOffset + benchW / 2, y: 0, z: pitchLength / 2 + 14 },
              { x: xOffset - benchW / 2, y: 0, z: pitchLength / 2 + 14 }
            ].map(pt => project(rotateX(rotateY(pt, rotationAngle.current), tilt)));

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
              ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
            ctx.fill();
            ctx.strokeStyle = '#00E5FF';
            ctx.lineWidth = 1.0;
            ctx.stroke();
          };
          drawPlayerBench(-30); // Home bench
          drawPlayerBench(30);  // Away bench
        }
      });

      // 2. PROJECT & DRAW SEATING TIERS
      const getZoneThemeColor = (name: string, isHovered: boolean, isSelected: boolean, tierType: 'lower' | 'upper') => {
        const density = getSectorDensity(name);

        if (simMode === 'EMERGENCY') {
          const flash = Math.floor(Date.now() / 250) % 2 === 0;
          return {
            fill: flash ? 'rgba(255, 23, 68, 0.45)' : 'rgba(255, 23, 68, 0.12)',
            stroke: 'rgba(255, 23, 68, 0.85)',
          };
        }

        if (isSelected) {
          return {
            fill: 'rgba(0, 229, 255, 0.45)',
            stroke: 'rgba(0, 229, 255, 0.95)',
          };
        }

        // Realistic stadium tier styling (lower tier general blue, upper tier premium codes)
        let baseColor = tierType === 'lower' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.13)';
        let strokeColor = 'rgba(34, 197, 94, 0.45)';

        if (density >= 0.9) {
          baseColor = 'rgba(239, 68, 68, 0.12)';
          strokeColor = 'rgba(239, 68, 68, 0.55)';
        } else if (density >= 0.8) {
          baseColor = 'rgba(249, 115, 22, 0.12)';
          strokeColor = 'rgba(249, 115, 22, 0.55)';
        } else if (density >= 0.7) {
          baseColor = 'rgba(234, 179, 8, 0.12)';
          strokeColor = 'rgba(234, 179, 8, 0.55)';
        }

        if (isHovered) {
          baseColor = baseColor.replace('0.08', '0.35').replace('0.12', '0.38').replace('0.13', '0.38');
          strokeColor = strokeColor.replace('0.45', '0.9').replace('0.55', '0.9');
        }

        return { fill: baseColor, stroke: strokeColor };
      };

      let currentHoveredStand: string | null = null;

      stands.forEach((standGroup) => {
        const isHovered = hoveredStand === standGroup.stand;
        const isSelected = selectedZone === standGroup.stand;
        const { fill, stroke } = getZoneThemeColor(standGroup.stand, isHovered, isSelected, standGroup.tierType);

        standGroup.polygons.forEach((poly) => {
          const rotPoly = poly.map((pt) => rotateX(rotateY(pt, rotationAngle.current), tilt));
          const projectedPoly = rotPoly.map((pt) => project(pt));
          const avgDepth = rotPoly.reduce((sum, pt) => sum + pt.z, 0) / 4;

          const mx = mousePos.current.x;
          const my = mousePos.current.y;
          let inside = false;
          for (let i = 0, j = projectedPoly.length - 1; i < projectedPoly.length; j = i++) {
            const xi = projectedPoly[i].x, yi = projectedPoly[i].y;
            const xj = projectedPoly[j].x, yj = projectedPoly[j].y;
            const intersect = ((yi > my) !== (yj > my)) && (mx < (xj - xi) * (my - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
          }

          if (inside) {
            currentHoveredStand = standGroup.stand;
          }

          renderQueue.push({
            depth: avgDepth,
            draw: () => {
              ctx.beginPath();
              ctx.moveTo(projectedPoly[0].x, projectedPoly[0].y);
              for (let i = 1; i < projectedPoly.length; i++) {
                ctx.lineTo(projectedPoly[i].x, projectedPoly[i].y);
              }
              ctx.closePath();

              ctx.fillStyle = fill;
              ctx.fill();

              ctx.strokeStyle = stroke;
              ctx.lineWidth = isHovered || isSelected ? 1.6 : 0.8;
              ctx.stroke();
            },
          });
        });
      });

      if (currentHoveredStand !== hoveredStand) {
        onStandHover(currentHoveredStand);
      }

      // 3. PROJECT & DRAW 8 OPEN-AIR FLOODLIGHT MASTS
      // Placed around the top rim of the upper tier bowl
      const lightSpansCount = 8;
      const lightRadiusX = 220;
      const lightRadiusZ = 180;
      const mastHeight = -75;

      for (let i = 0; i < lightSpansCount; i++) {
        const angle = -Math.PI + (i / lightSpansCount) * Math.PI * 2;
        const towerTop = { x: Math.cos(angle) * lightRadiusX, y: mastHeight, z: Math.sin(angle) * lightRadiusZ };
        const towerBottom = { x: Math.cos(angle) * (lightRadiusX + 8), y: -38, z: Math.sin(angle) * (lightRadiusZ + 8) };

        const topRot = rotateX(rotateY(towerTop, rotationAngle.current), tilt);
        const bottomRot = rotateX(rotateY(towerBottom, rotationAngle.current), tilt);
        const depth = topRot.z;

        renderQueue.push({
          depth: depth - 10,
          draw: () => {
            const pTop = project(topRot);
            const pBottom = project(bottomRot);

            // Skeletal Mast Column
            ctx.beginPath();
            ctx.moveTo(pTop.x, pTop.y);
            ctx.lineTo(pBottom.x, pBottom.y);
            ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 229, 255, 0.4)' : 'rgba(0, 87, 255, 0.45)';
            ctx.lineWidth = 2.0;
            ctx.stroke();

            // Light Panel array box
            ctx.beginPath();
            ctx.arc(pTop.x, pTop.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = theme === 'dark' ? '#00E5FF' : '#0057FF';
            ctx.fill();

            // Volumetric Floodlight beams throwing down to the pitch center
            const targetRot = rotateX(rotateY({ x: Math.cos(angle) * 60, y: 0, z: Math.sin(angle) * 50 }, rotationAngle.current), tilt);
            const pTarget = project(targetRot);

            const beamGrad = ctx.createLinearGradient(pTop.x, pTop.y, pTarget.x, pTarget.y);
            beamGrad.addColorStop(0, theme === 'dark' ? 'rgba(0, 229, 255, 0.22)' : 'rgba(0, 87, 255, 0.18)');
            beamGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');

            ctx.beginPath();
            ctx.moveTo(pTop.x, pTop.y);
            ctx.lineTo(pTarget.x - 30, pTarget.y);
            ctx.lineTo(pTarget.x + 30, pTarget.y);
            ctx.closePath();
            ctx.fillStyle = beamGrad;
            ctx.fill();
          }
        });
      }

      // 4. DRAW GATE LABELS & SECTOR INLETS
      const sectorsCount = 8;
      const labelRadiusX = 240;
      const labelRadiusZ = 200;

      for (let i = 0; i < sectorsCount; i++) {
        const angle = -Math.PI + (i / sectorsCount) * Math.PI * 2 + (Math.PI / sectorsCount);
        const gateLabelPos = { x: Math.cos(angle) * labelRadiusX, y: -20, z: Math.sin(angle) * labelRadiusZ };

        const rotPos = rotateX(rotateY(gateLabelPos, rotationAngle.current), tilt);
        const depth = rotPos.z;

        renderQueue.push({
          depth: depth - 12,
          draw: () => {
            const pt = project(rotPos);

            // Draw a neat label badge
            ctx.fillStyle = theme === 'dark' ? '#05070D' : '#ffffff';
            ctx.strokeStyle = theme === 'dark' ? '#00E5FF' : '#0057FF';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#090a0f';
            ctx.font = 'bold 7px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`G${i + 1}`, pt.x, pt.y + 2.5);
          }
        });
      }

      // 5. DRAW CROWD PARTICLES (Active glowing fans)
      particles.forEach((part, idx) => {
        let flowDir = 1;
        if (simMode === 'EMERGENCY') {
          flowDir = 2.5;
        }

        const angleSpeed = (0.006 + (idx % 4) * 0.002) * flowDir;
        const radiusX = Math.sqrt(part.x * part.x + part.z * part.z);
        const currentAngle = Math.atan2(part.z, part.x) + angleSpeed;

        let radialExpansion = 0;
        if (simMode === 'EMERGENCY') {
          radialExpansion = 1.2;
        }

        const newRadiusX = radiusX + radialExpansion;
        if (newRadiusX > 320) {
          part.x = Math.cos(currentAngle) * 140;
          part.z = Math.sin(currentAngle) * 105;
        } else {
          part.x = Math.cos(currentAngle) * newRadiusX;
          part.z = Math.sin(currentAngle) * (newRadiusX * 0.72);
        }

        const p_rot = rotateX(rotateY(part, rotationAngle.current), tilt);
        const depth = p_rot.z;

        renderQueue.push({
          depth,
          draw: () => {
            const pt = project(p_rot);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, part.size || 1.2, 0, Math.PI * 2);
            ctx.fillStyle = simMode === 'EMERGENCY' ? '#FF1744' : '#00E5FF';
            ctx.fill();
          },
        });
      });

      // 6. SORT & RENDER QUEUE
      renderQueue.sort((a, b) => b.depth - a.depth);
      renderQueue.forEach((item) => item.draw());

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUpOrLeave);
      canvas.removeEventListener('mouseleave', handleMouseUpOrLeave);
      canvas.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(animationId);
    };
  }, [hoveredStand, onStandHover, theme, simMode, selectedZone, onZoneSelect, zoom, tilt, autoRotate]);

  return (
    <div className={`w-full relative flex flex-col items-center justify-center rounded-2xl overflow-hidden border border-zinc-800/40 shadow-inner p-4 ${
      theme === 'dark' ? 'bg-[#05070D]' : 'bg-gray-50'
    }`}>
      
      {/* 3D Viewport Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-1 bg-zinc-900/80 border border-zinc-800 p-1.5 rounded-xl">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.6))}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setZoom(1.05);
            setTilt(0.32);
            setAutoRotate(true);
          }}
          title="Reset View"
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hologram Controls Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2 bg-zinc-900/85 border border-zinc-800/80 px-3 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider text-zinc-400">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]"></span>
        </span>
        <span>Open-Air Arena Twin</span>
        <span className="text-zinc-650">|</span>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`hover:text-white transition-colors cursor-pointer ${autoRotate ? 'text-[#00E5FF]' : ''}`}
        >
          {autoRotate ? 'Rotate: On' : 'Rotate: Off'}
        </button>
      </div>

      <canvas ref={canvasRef} className="w-full block select-none cursor-grab active:cursor-grabbing" />
    </div>
  );
};
