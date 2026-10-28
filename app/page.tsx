import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GaleriaCarousel from '@/components/GaleriaCarousel';
import { 
  Scissors, 
  Clock, 
  Calendar, 
  MapPin, 
  Beer, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { getServicos, getBarbeiros } from '@/lib/repository';

export default async function HomePage() {
  const servicos = await getServicos();
  const barbeiros = await getBarbeiros();

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        
        {/* ========================================================== */}
        {/* HERO SECTION VINTAGE */}
        {/* ========================================================== */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#12141A] via-[#0E1015] to-[#0A0B0E] py-16 px-4 sm:px-6 lg:px-8">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D27] border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Barbearia Clássica Anos 50 em Poá - SP
            </div>

            {/* Main Title & Brand Graphic */}
            <div className="space-y-3">
              <div className="flex justify-center mb-2">
                <Image
                  src="/images/bigode.png"
                  alt="Bigode Clássico"
                  width={140}
                  height={45}
                  className="opacity-90 drop-shadow-md"
                  priority
                />
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F5F3EF]">
                BARBEARIA <span className="vintage-text-gold">VAL</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#B8B5AE] leading-relaxed">
                Mais do que um corte, um momento de respeito e tradição. Sala de espera aconchegante, mesa de sinuca, bebidas geladas e profissionais de alto nível.
              </p>
            </div>

            {/* CTAs Principais */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/agendamento"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-[#D4AF37]/20"
              >
                <Calendar className="w-5 h-5" />
                Agendar Horário Online
              </Link>

              <Link
                href="#servicos"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#161922] hover:bg-[#1E222E] border border-[#2B2F3D] text-[#F5F3EF] font-semibold text-base flex items-center justify-center gap-2 transition-colors"
              >
                <Scissors className="w-4 h-4 text-[#D4AF37]" />
                Ver Serviços & Preços
              </Link>
            </div>

            {/* Highlights */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-[#13151D]/80 border border-[#232733] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Beer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EF]">Bebidas</h4>
                  <p className="text-[11px] text-[#8E8B82]">Cerveja gelada</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#13151D]/80 border border-[#232733] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EF]">Mesa de Sinuca</h4>
                  <p className="text-[11px] text-[#8E8B82]">Para descontrair</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#13151D]/80 border border-[#232733] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EF]">Sem Espera</h4>
                  <p className="text-[11px] text-[#8E8B82]">Horário marcado</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#13151D]/80 border border-[#232733] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EF]">Estilo Anos 50</h4>
                  <p className="text-[11px] text-[#8E8B82]">Barbearia clássica</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================== */}
        {/* NOSSOS BARBEIROS (VAL & HEITOR) - VISUAL LIMPO */}
        {/* ========================================================== */}
        <section id="barbeiros" className="py-20 bg-[#0B0C0F] border-t border-[#1C1F2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Profissionais Especializados
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF]">
                Nossos Barbeiros
              </h2>
              <p className="text-sm text-[#B8B5AE]">
                Tradição e técnica apurada em todos os estilos de corte, barba e química.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Card Val */}
              <div className="group bg-[#13161F] border border-[#262B3A] hover:border-[#D4AF37]/50 rounded-2xl p-6 transition-all duration-300 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#1D212E] border border-[#D4AF37]/40 flex-shrink-0 flex items-center justify-center">
                    <div className="text-center">
                      <Scissors className="w-7 h-7 text-[#D4AF37] mx-auto mb-1" />
                      <span className="text-[10px] uppercase font-bold text-[#B8B5AE]">Val</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-center sm:text-left flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-serif text-2xl font-bold text-[#F5F3EF]">
                        Val
                      </h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37]">
                        Mestre Barbeiro
                      </span>
                    </div>
                    <p className="text-xs text-[#B8B5AE] leading-relaxed">
                      Fundador da barbearia. Especialista em navalha clássica, barboterapia, cortes tradicionais e atendimento personalizado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Heitor */}
              <div className="group bg-[#13161F] border border-[#262B3A] hover:border-[#D4AF37]/50 rounded-2xl p-6 transition-all duration-300 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#1D212E] border border-[#D4AF37]/40 flex-shrink-0 flex items-center justify-center">
                    <div className="text-center">
                      <Scissors className="w-7 h-7 text-[#D4AF37] mx-auto mb-1" />
                      <span className="text-[10px] uppercase font-bold text-[#B8B5AE]">Heitor</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-center sm:text-left flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-serif text-2xl font-bold text-[#F5F3EF]">
                        Heitor
                      </h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37]">
                        Barbeiro & Colorista
                      </span>
                    </div>
                    <p className="text-xs text-[#B8B5AE] leading-relaxed">
                      Especialista em degradês modernos (Fade), barba alinhada, platinados, luzes e procedimentos químicos.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* SERVIÇOS & PREÇOS (CLICAR REDIRECIONA PARA ESCOLHER BARBEIRO) */}
        {/* ========================================================== */}
        <section id="servicos" className="py-20 bg-[#0E1015]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Tabela Oficial
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF]">
                Serviços & Preços
              </h2>
              <p className="text-sm text-[#B8B5AE]">
                Toque em qualquer serviço abaixo para já escolher o seu barbeiro e horário.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {servicos.map((serv) => (
                <Link
                  key={serv.id}
                  href={`/agendamento?servico=${serv.id}`}
                  className="group p-5 rounded-xl bg-[#141720] border border-[#232733] hover:border-[#D4AF37] hover:bg-[#181C27] transition-all flex items-center justify-between gap-4 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#D4AF37]/10"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors">
                        {serv.nome}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#1D212B] text-[#B8B5AE]">
                        {serv.categoria}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8E8B82]">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{serv.duracao_min} minutos</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex items-center gap-3">
                    <div>
                      <span className="block text-xl font-bold font-serif text-[#D4AF37]">
                        R$ {serv.preco.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B8B5AE] group-hover:text-[#F5F3EF] transition-colors">
                        Escolher Barbeiro
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#8E8B82] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* CONHEÇA O AMBIENTE & GALERIA COM CARROSSEL DE FOTOS */}
        {/* ========================================================== */}
        <section id="galeria" className="py-20 bg-[#0B0C0E] border-t border-[#1C1F2A]">
          <div id="sobre" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1C1F2B] text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
                  Conheça o Ambiente • Galeria
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF] leading-tight">
                  Inspirada nas barbearias clássicas dos anos 50
                </h2>
                <p className="text-sm text-[#B8B5AE] leading-relaxed">
                  A Barbearia Val foi projetada para quem valoriza o cuidado pessoal sem abrir mão do conforto e de uma boa conversa. Passe as fotos ao lado para conhecer cada detalhe do nosso espaço:
                </p>

                <ul className="space-y-3 text-sm text-[#F5F3EF]">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    <span>Mesa de sinuca oficial para jogar à vontade</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    <span>Cervejeira recheada de bebidas sempre geladas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    <span>Poltronas vintage reclináveis e iluminação clássica</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    <span>Sala de espera espaçosa, climatizada e com Wi-Fi</span>
                  </li>
                </ul>
              </div>

              {/* Carrossel Interativo com as Fotos da Barbearia */}
              <GaleriaCarousel />

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* LOCALIZAÇÃO E CONTATO */}
        {/* ========================================================== */}
        <section id="contato" className="py-20 bg-[#0E1015] border-t border-[#1C1F2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Como Chegar
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF]">
                Venha nos Visitar
              </h2>
              <p className="text-sm text-[#B8B5AE]">
                Fácil acesso em Poá/SP com estacionamento na região.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Infos */}
              <div className="space-y-6 bg-[#13161F] p-6 rounded-2xl border border-[#252836]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F5F3EF] mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" /> Endereço
                  </h3>
                  <p className="text-sm text-[#B8B5AE] leading-relaxed">
                    Av. Adutora, 530<br />
                    Jardim Nova Poá, Poá - SP<br />
                    CEP 08568-300
                  </p>
                </div>

                <div className="border-t border-[#20232E] pt-4">
                  <h3 className="font-serif text-xl font-bold text-[#F5F3EF] mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D4AF37]" /> Horários
                  </h3>
                  <p className="text-xs text-[#B8B5AE] space-y-1">
                    <span className="block"><strong>Terça a Sexta:</strong> 09h às 20h</span>
                    <span className="block"><strong>Sábado:</strong> 08h às 20h</span>
                    <span className="block"><strong>Domingo:</strong> 08h às 12h</span>
                    <span className="block text-red-400"><strong>Segunda:</strong> Fechado</span>
                  </p>
                </div>

                <div className="border-t border-[#20232E] pt-4">
                  <a
                    href="https://maps.google.com/?q=Av.+Adutora,+530+-+Jardim+Nova+Poá,+Poá+-+SP,+08568-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-2.5 rounded-lg bg-[#1B1E28] hover:bg-[#252A38] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold transition-colors"
                  >
                    Abrir no Google Maps
                  </a>
                </div>
              </div>

              {/* Mapa Embed */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#252836] shadow-xl min-h-[300px]">
                <iframe
                  title="Localização Barbearia Val"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.409383637682!2d-46.347895!3d-23.553755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce7b1e4f4d2f07%3A0x6b44a30e8c7857b7!2sAv.%20Adutora%2C%20530%20-%20Jardim%20Nova%20Po%C3%A1%2C%20Po%C3%A1%20-%20SP%2C%2008568-300!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                  width="100%"
                  height="100%"
                  className="w-full h-full min-h-[350px] border-0 grayscale contrast-125 opacity-90"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
