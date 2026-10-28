'use client';

import React, { useRef, useState, useCallback } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees, default 14
  glareOpacity?: number; // max glare opacity, default 0.25
  scaleOnHover?: number; // scale factor on hover, default 1.03
  depth?: number; // general translateZ for pop effect
}

export default function Card3D({
  children,
  className = '',
  maxTilt = 12,
  glareOpacity = 0.22,
  scaleOnHover = 1.025,
  depth = 20,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );
  const [glareStyle, setGlareStyle] = useState<{
    opacity: number;
    background: string;
  }>({
    opacity: 0,
    background: 'none',
  });
  const [shadowStyle, setShadowStyle] = useState<string>('0 10px 30px -10px rgba(0,0,0,0.5)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top; // y position within card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Calculate glare percentage (0 to 100%)
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      // Shadow offset in opposite direction of tilt for physical depth illusion
      const shadowX = -rotateY * 1.5;
      const shadowY = rotateX * 1.5 + 15;

      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2
        )}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover}) translateZ(${depth}px)`
      );

      setGlareStyle({
        opacity: glareOpacity,
        background: `radial-gradient(circle 240px at ${glareX.toFixed(1)}% ${glareY.toFixed(
          1
        )}%, rgba(212, 175, 55, 0.45) 0%, rgba(255, 215, 0, 0.15) 30%, transparent 70%)`,
      });

      setShadowStyle(
        `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 35px -5px rgba(0, 0, 0, 0.7), 0 0 25px -5px rgba(212, 175, 55, 0.2)`
      );
    },
    [maxTilt, glareOpacity, scaleOnHover, depth]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth reset to neutral position
    setTransformStyle(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)'
    );
    setGlareStyle({
      opacity: 0,
      background: 'none',
    });
    setShadowStyle('0 10px 30px -10px rgba(0,0,0,0.5)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        boxShadow: shadowStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.08s ease-out'
          : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* Card Content with 3D depth */}
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {/* Dynamic 3D Glare Reflection (Alche / Holographic card effect) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30 overflow-hidden"
        style={{
          opacity: glareStyle.opacity,
          background: glareStyle.background,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

