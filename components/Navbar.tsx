'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0E1014]/90 backdrop-blur-md border-b border-[#252833]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center rounded-full bg-[#181B22] border border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-all">
            <Image
              src="/images/tesoura-pente.png"
              alt="Logo Barbearia Val"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div>
            <span className="block font-serif text-xl tracking-wider text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors">
              VAL BARBEARIA
            </span>
            <span className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-medium">
              EST. POÁ / SP
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#sobre" className="text-sm font-medium text-[#B8B5AE] hover:text-[#D4AF37] transition-colors">
            Sobre Nós
          </Link>
          <Link href="/#barbeiros" className="text-sm font-medium text-[#B8B5AE] hover:text-[#D4AF37] transition-colors">
            Nossos Barbeiros
          </Link>
          <Link href="/#servicos" className="text-sm font-medium text-[#B8B5AE] hover:text-[#D4AF37] transition-colors">
            Serviços & Preços
          </Link>
          <Link href="/#galeria" className="text-sm font-medium text-[#B8B5AE] hover:text-[#D4AF37] transition-colors">
            Galeria
          </Link>
          <Link href="/#contato" className="text-sm font-medium text-[#B8B5AE] hover:text-[#D4AF37] transition-colors">
            Localização
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg bg-[#181B22] text-[#F5F3EF] border border-[#2B2E3A]"
            aria-label="Abrir menu de navegação"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#12141A] border-b border-[#252833] px-6 py-5 space-y-4">
          <Link
            href="/#sobre"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37]"
          >
            Sobre Nós
          </Link>
          <Link
            href="/#barbeiros"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37]"
          >
            Nossos Barbeiros
          </Link>
          <Link
            href="/#servicos"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37]"
          >
            Serviços & Preços
          </Link>
          <Link
            href="/#galeria"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37]"
          >
            Galeria
          </Link>
          <Link
            href="/#contato"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37]"
          >
            Localização & Horários
          </Link>
        </div>
      )}
    </header>
  );
}
