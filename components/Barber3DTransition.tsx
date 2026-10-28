'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import Card3D from './Card3D';

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
          glowColor: 'rgba(212, 175, 55, 0.35)',
          badgeText: 'Render 3D • Tesoura de Ouro',
        };
      case 'barber-pole':
        return {
          src: '/images/3d-barber-pole.jpg',
          alt: 'Barber Pole Vintage 3D',
          glowColor: 'rgba(239, 68, 68, 0.3)',
          badgeText: 'Render 3D • Barber Pole 1950',
        };
      case 'razor':
        return {
          src: '/images/3d-razor.jpg',
          alt: 'Navalha Clássica de Ouro 3D',
          glowColor: 'rgba(212, 175, 55, 0.35)',
          badgeText: 'Render 3D • Aço Damasco & Ouro',
        };
    }
  };

  const data = getImageData();

  return (
    <div className="relative py-12 sm:py-16 overflow-hidden pointer-events-none select-none">
      {/* Background divider line with gold gradient & light pulse */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
      
      {/* Soft ambient backlight */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[120px] rounded-full blur-[90px] pointer-events-none opacity-60"
        style={{ backgroundColor: data.glowColor }}
      />

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
          <Card3D
            maxTilt={16}
            glareOpacity={0.3}
            scaleOnHover={1.04}
            depth={25}
            className="rounded-3xl"
          >
            <div
              className={`flex items-center gap-5 sm:gap-7 bg-[#12141C]/85 backdrop-blur-xl border border-[#D4AF37]/35 hover:border-[#D4AF37] px-6 py-4 sm:py-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-500 group ${
                flip ? 'flex-row-reverse text-right' : 'text-left'
              }`}
            >
              {/* 3D Floating Asset with Dynamic Pop & Depth */}
              <div 
                className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 animate-float-slow"
                style={{ transform: 'translateZ(35px)' }}
              >
                {/* Radial Glow */}
                <div
                  className="absolute inset-0 rounded-2xl blur-xl animate-pulse-glow"
                  style={{ backgroundColor: data.glowColor }}
                ></div>

                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_10px_25px_rgba(0,0,0,0.9)] group-hover:border-[#D4AF37] transition-all">
                  <Image
                    src={data.src}
                    alt={data.alt}
                    fill
                    className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Content Text with 3D Z-Pop */}
              <div className="space-y-1.5" style={{ transform: 'translateZ(20px)' }}>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1D29] border border-[#D4AF37]/30 text-[10px] sm:text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>{tag}</span>
                </div>
                
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#F5F3EF] leading-snug group-hover:text-[#D4AF37] transition-colors">
                  {title}
                </h4>
                
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#B8B5AE] max-w-sm leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </Card3D>
        </ScrollReveal>
      </div>
    </div>
  );
}
