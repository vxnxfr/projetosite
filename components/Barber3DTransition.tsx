'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface Barber3DTransitionProps {
  type: 'scissors' | 'barber-pole' | 'razor';
  tag: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'right' | 'center';
  flip?: boolean;
}

export default function Barber3DTransition({
  type,
  tag,
  title,
  subtitle,
  align = 'right',
  flip = false,
}: Barber3DTransitionProps) {
  const getImageData = () => {
    switch (type) {
      case 'scissors':
        return {
          src: '/images/3d-scissors.jpg',
          alt: 'Tesoura Vintage de Ouro 3D',
          glowColor: 'rgba(212, 175, 55, 0.25)',
        };
      case 'barber-pole':
        return {
          src: '/images/3d-barber-pole.jpg',
          alt: 'Barber Pole Vintage 3D',
          glowColor: 'rgba(239, 68, 68, 0.2)',
        };
      case 'razor':
        return {
          src: '/images/3d-razor.jpg',
          alt: 'Navalha Clássica de Ouro 3D',
          glowColor: 'rgba(212, 175, 55, 0.25)',
        };
    }
  };

  const data = getImageData();

  return (
    <div className="relative py-10 overflow-hidden pointer-events-none select-none">
      {/* Background divider line with gold gradient */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pointer-events-auto">
        <ScrollReveal
          direction={align === 'left' ? 'left' : align === 'right' ? 'right' : 'zoom'}
          className={`flex items-center ${
            align === 'left'
              ? 'justify-start'
              : align === 'right'
              ? 'justify-end'
              : 'justify-center'
          }`}
        >
          <div
            className={`flex items-center gap-4 sm:gap-6 bg-[#13151D]/90 backdrop-blur-md border border-[#D4AF37]/30 hover:border-[#D4AF37] px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/80 transition-all duration-500 group ${
              flip ? 'flex-row-reverse text-right' : 'text-left'
            }`}
          >
            {/* 3D Floating Asset with Glow */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 animate-float-slow group-hover:scale-105 transition-transform duration-500">
              {/* Radial Glow */}
              <div
                className="absolute inset-0 rounded-full blur-xl animate-pulse-glow"
                style={{ backgroundColor: data.glowColor }}
              ></div>

              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-lg">
                <Image
                  src={data.src}
                  alt={data.alt}
                  fill
                  className="object-cover group-hover:rotate-3 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Content Text */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>{tag}</span>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#F5F3EF] leading-snug">
                {title}
              </h4>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-[#8E8B82] max-w-xs">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

