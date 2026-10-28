'use client';

import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight } from 'lucide-react';
import { BARBEIROS_CONTATO } from '@/lib/constants';

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-72 bg-[#14161E] border border-[#2B2E3D] rounded-2xl shadow-2xl p-4 text-[#F5F3EF] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#252836]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-sm">Fale no WhatsApp</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#8E8B82] hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#B8B5AE] my-3">
            Escolha com quem deseja falar diretamente:
          </p>

          <div className="space-y-2">
            {/* Val */}
            <a
              href={`https://wa.me/${BARBEIROS_CONTATO.VAL.whatsapp}?text=Ol%C3%A1%20Val,%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20Barbearia!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#1D212B] hover:bg-[#252A38] border border-[#2F3445] transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-[#F5F3EF] group-hover:text-[#D4AF37]">Val</p>
                <p className="text-[11px] text-[#8E8B82]">{BARBEIROS_CONTATO.VAL.whatsappDisplay}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8B82] group-hover:text-[#D4AF37]" />
            </a>

            {/* Heitor */}
            <a
              href={`https://wa.me/${BARBEIROS_CONTATO.HEITOR.whatsapp}?text=Ol%C3%A1%20Heitor,%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20Barbearia!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#1D212B] hover:bg-[#252A38] border border-[#2F3445] transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-[#F5F3EF] group-hover:text-[#D4AF37]">Heitor</p>
                <p className="text-[11px] text-[#8E8B82]">{BARBEIROS_CONTATO.HEITOR.whatsappDisplay}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8B82] group-hover:text-[#D4AF37]" />
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Abrir conversa no WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
