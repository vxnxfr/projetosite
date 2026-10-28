import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Clock } from 'lucide-react';
import { BARBEIROS_CONTATO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#090A0C] border-t border-[#1F222C] text-[#B8B5AE] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Coluna 1: Marca */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#181B22] border border-[#D4AF37]/50 flex items-center justify-center">
              <Image
                src="/images/tesoura-pente.png"
                alt="Barbearia Val"
                width={22}
                height={22}
              />
            </div>
            <div>
              <span className="font-serif text-lg text-[#F5F3EF] block">VAL BARBEARIA</span>
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Estilo Clássico</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#8E8B82]">
            Inspirada nas barbearias clássicas dos anos 50. Ambiente aconchegante com sala de espera, cerveja gelada e mesa de sinuca.
          </p>
          <div className="pt-2">
            <Image
              src="/images/bigode.png"
              alt="Bigode Vintage"
              width={100}
              height={30}
              className="opacity-70"
            />
          </div>
        </div>

        {/* Coluna 2: Horários */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F5F3EF] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" /> Horário de Funcionamento
          </h4>
          <ul className="text-xs space-y-2">
            <li className="flex justify-between border-b border-[#1A1D26] pb-1">
              <span>Terça a Sexta:</span>
              <span className="text-[#F5F3EF] font-medium">09:00 - 20:00</span>
            </li>
            <li className="flex justify-between border-b border-[#1A1D26] pb-1">
              <span>Sábado:</span>
              <span className="text-[#F5F3EF] font-medium">08:00 - 20:00</span>
            </li>
            <li className="flex justify-between border-b border-[#1A1D26] pb-1">
              <span>Domingo:</span>
              <span className="text-[#F5F3EF] font-medium">08:00 - 12:00</span>
            </li>
            <li className="flex justify-between text-red-400">
              <span>Segunda:</span>
              <span>Fechado</span>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Contatos */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F5F3EF] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4AF37]" /> Contatos
          </h4>
          <ul className="text-xs space-y-2.5">
            <li className="flex items-center gap-2">
              <span className="text-[#8E8B82]">Val:</span>
              <a href={`https://wa.me/${BARBEIROS_CONTATO.VAL.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[#F5F3EF] hover:text-[#D4AF37]">
                {BARBEIROS_CONTATO.VAL.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8E8B82]">Heitor:</span>
              <a href={`https://wa.me/${BARBEIROS_CONTATO.HEITOR.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[#F5F3EF] hover:text-[#D4AF37]">
                {BARBEIROS_CONTATO.HEITOR.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <a href="mailto:valbarbearia1@gmail.com" className="text-[#F5F3EF] hover:text-[#D4AF37]">
                valbarbearia1@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5 text-[#D4AF37]" />
              <a href="https://www.instagram.com/valbarbearia2" target="_blank" rel="noopener noreferrer" className="text-[#F5F3EF] hover:text-[#D4AF37]">
                @valbarbearia2
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Endereço */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F5F3EF] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" /> Endereço
          </h4>
          <p className="text-xs leading-relaxed text-[#8E8B82]">
            Av. Adutora, 530<br />
            Jardim Nova Poá, Poá - SP<br />
            CEP 08568-300
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-[#181B24] flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#6E717D] gap-2">
        <p>© {new Date().getFullYear()} Barbearia Val - Poá / SP. Todos os direitos reservados.</p>
        <p>Sistema moderno de agendamento online com SQL Server.</p>
      </div>
    </footer>
  );
}
