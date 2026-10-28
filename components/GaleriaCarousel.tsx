'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FOTOS_GALERIA = [
  {
    src: '/images/galeria-1.png',
    titulo: 'Bancadas & Cadeiras Clássicas',
    subtitulo: 'Poltronas retrô reclináveis e ambiente climatizado em Poá / SP'
  },
  {
    src: '/images/galeria-2.png',
    titulo: 'Sala de Espera Aconchegante',
    subtitulo: 'Conforto e decoração inspirada nos anos 50 para você relaxar'
  },
  {
    src: '/images/galeria-3.png',
    titulo: 'Geladeira & Espaço de Bebidas',
    subtitulo: 'Opções de refrigerante, cerveja e etc. sempre gelados para você'
  },
  {
    src: '/images/galeria-4.png',
    titulo: 'Tradição no Atendimento',
    subtitulo: 'Cortes precisos e barboterapia com profissionais dedicados'
  }
];

export default function GaleriaCarousel() {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const proximoSlide = () => {
    setIndiceAtual((prev) => (prev === FOTOS_GALERIA.length - 1 ? 0 : prev + 1));
  };

  const slideAnterior = () => {
    setIndiceAtual((prev) => (prev === 0 ? FOTOS_GALERIA.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-4">
      {/* Container Principal do Carrossel */}
      <div className="relative rounded-2xl overflow-hidden border border-[#2B2F3D] shadow-2xl group bg-[#12141C]">
        <div className="aspect-[4/3] relative w-full overflow-hidden">
          <Image
            src={FOTOS_GALERIA[indiceAtual].src}
            alt={FOTOS_GALERIA[indiceAtual].titulo}
            fill
            className="object-cover transition-all duration-500"
            priority={indiceAtual === 0}
          />

          {/* Gradiente e Legenda estilo "Conheça o Ambiente" */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6">
            <div className="space-y-1 max-w-md">
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Foto {indiceAtual + 1} de {FOTOS_GALERIA.length} • Nosso Espaço
              </p>
              <p className="text-lg sm:text-xl font-serif font-bold text-white">
                {FOTOS_GALERIA[indiceAtual].titulo}
              </p>
              <p className="text-xs text-[#D5D2CB]">
                {FOTOS_GALERIA[indiceAtual].subtitulo}
              </p>
            </div>
          </div>

          {/* Botão Esquerda (Passar para o lado) */}
          <button
            type="button"
            onClick={slideAnterior}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Botão Direita (Passar para o lado) */}
          <button
            type="button"
            onClick={proximoSlide}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Miniaturas / Indicadores para clique rápido */}
      <div className="grid grid-cols-4 gap-2.5">
        {FOTOS_GALERIA.map((foto, idx) => {
          const ativo = idx === indiceAtual;
          return (
            <button
              key={foto.src}
              type="button"
              onClick={() => setIndiceAtual(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                ativo
                  ? 'border-[#D4AF37] scale-[1.02] shadow-md shadow-[#D4AF37]/20'
                  : 'border-[#232733] opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={foto.src}
                alt={foto.titulo}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

