import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GaleriaCarousel from '@/components/GaleriaCarousel';
import ScrollReveal from '@/components/ScrollReveal';
import Barber3DTransition from '@/components/Barber3DTransition';
import { getServiceImage } from '@/lib/serviceImages';
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
                Mais do que um corte, uma experiência de respeito e tradição. Sala de espera aconchegante, refrigerantes e cervejas sempre gelados, e profissionais de alto nível.
              </p>
            </div>

            {/* Highlights */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-[#13151D]/80 border border-[#232733] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Beer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EF]">Bebidas</h4>
                  <p className="text-[11px] text-[#8E8B82]">Refrigerantes & cervejas</p>
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
        {/* TRANSIÇÃO 3D #1: TESOURAS VINTAGE DE OURO */}
        {/* ========================================================== */}
        <Barber3DTransition
          type="scissors"
          tag="Arte & Tradição"
          title="Precisão em Cada Detalhe"
          subtitle="Do corte clássico na tesoura ao degradê moderno com acabamento impecável."
          align="right"
        />

        {/* ========================================================== */}
        {/* SOBRE NÓS - APRESENTAÇÃO DA BARBEARIA (ANTES DE BARBEIROS) */}
        {/* ========================================================== */}
        <section id="sobre" className="py-20 bg-[#0D0F14] border-t border-[#1C1F2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Texto de Apresentação */}
              <ScrollReveal direction="left" className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181B26] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
                  Sobre Nós • Nossa Essência
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF] leading-tight">
                  Mais que uma barbearia, um ponto de encontro clássico em Poá
                </h2>

                <p className="text-sm sm:text-base text-[#B8B5AE] leading-relaxed">
                  Localizada no coração do Jardim Nova Poá, a <strong className="text-[#F5F3EF]">Barbearia Val</strong> nasceu com o propósito de resgatar a atmosfera autêntica das barbearias clássicas dos anos 50 — onde o cliente não vem apenas cortar o cabelo na pressa, mas viver uma experiência de cuidado, respeito e descontração.
                </p>

                <p className="text-sm text-[#8E8B82] leading-relaxed">
                  Unimos a tradição da navalha clássica e da barboterapia às técnicas mais modernas de degradê, acabamento e química masculina. Seja para renovar o visual para a semana, bater um papo na nossa sala de espera ou tomar uma bebida gelada, aqui você se sente em casa.
                </p>
              </ScrollReveal>

              {/* Destaques da Identidade da Barbearia */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                <ScrollReveal delay={100} direction="right">
                  <div className="p-5 rounded-2xl bg-[#13161F] border border-[#242836] hover:border-[#D4AF37]/40 transition-all flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex-shrink-0">
                      <Scissors className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#F5F3EF]">Excelência nos Detalhes</h3>
                      <p className="text-xs text-[#B8B5AE] mt-1 leading-relaxed">
                        Do corte tradicional ao fade moderno e platinado, com acabamento impecável na navalha.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200} direction="right">
                  <div className="p-5 rounded-2xl bg-[#13161F] border border-[#242836] hover:border-[#D4AF37]/40 transition-all flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex-shrink-0">
                      <Beer className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#F5F3EF]">Lazer & Conforto</h3>
                      <p className="text-xs text-[#B8B5AE] mt-1 leading-relaxed">
                        Sala de espera espaçosa e acolhedora, com refrigerantes e cervejas sempre à temperatura ideal.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={300} direction="right">
                  <div className="p-5 rounded-2xl bg-[#13161F] border border-[#242836] hover:border-[#D4AF37]/40 transition-all flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex-shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#F5F3EF]">Para Todas as Gerações</h3>
                      <p className="text-xs text-[#B8B5AE] mt-1 leading-relaxed">
                        Ambiente familiar e acolhedor que atende adultos e crianças com hora marcada e pontualidade.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* TRANSIÇÃO 3D #2: BARBER POLE RETRÔ ILUMINADO */}
        {/* ========================================================== */}
        <Barber3DTransition
          type="barber-pole"
          tag="Ambiente Autêntico"
          title="Espaço Clássico dos Anos 50"
          subtitle="Iluminação aconchegante, poltronas confortáveis e sala de espera completa."
          align="left"
          flip
        />

        {/* ========================================================== */}
        {/* NOSSOS BARBEIROS (VAL & HEITOR) - VISUAL LIMPO */}
        {/* ========================================================== */}
        <section id="barbeiros" className="py-20 bg-[#0B0C0F] border-t border-[#1C1F2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Profissionais Especializados
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF]">
                Nossos Barbeiros
              </h2>
              <p className="text-sm text-[#B8B5AE]">
                Tradição e técnica apurada em todos os estilos de corte, barba e química.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Card Val */}
              <ScrollReveal delay={100} direction="left">
                <div className="group bg-[#13161F] border border-[#262B3A] hover:border-[#D4AF37] rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#1D212E] border-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] flex-shrink-0 shadow-md transition-colors">
                      <Image
                        src="/images/barbeiro-val.jpg"
                        alt="Mestre Barbeiro Val"
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-2.5 text-center sm:text-left flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-serif text-2xl font-bold text-[#F5F3EF]">
                          Val
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                          Mestre Barbeiro
                        </span>
                      </div>
                      <p className="text-xs text-[#B8B5AE] leading-relaxed">
                        Fundador da barbearia. Especialista em navalha clássica, barboterapia, cortes tradicionais e atendimento personalizado.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card Heitor */}
              <ScrollReveal delay={200} direction="right">
                <div className="group bg-[#13161F] border border-[#262B3A] hover:border-[#D4AF37] rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#1D212E] border-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] flex-shrink-0 shadow-md transition-colors">
                      <Image
                        src="/images/barbeiro-heitor.jpg"
                        alt="Barbeiro Heitor"
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-2.5 text-center sm:text-left flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-serif text-2xl font-bold text-[#F5F3EF]">
                          Heitor
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                          Barbeiro & Colorista
                        </span>
                      </div>
                      <p className="text-xs text-[#B8B5AE] leading-relaxed">
                        Especialista em degradês modernos (Fade), barba alinhada, platinados, luzes e procedimentos químicos.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* TRANSIÇÃO 3D #3: NAVALHA DAMASCO COM DETALHES DE OURO */}
        {/* ========================================================== */}
        <Barber3DTransition
          type="razor"
          tag="Barboterapia & Navalha"
          title="Alinhamento e Acabamento Impecável"
          subtitle="Toalha quente, produtos premium e a precisão da navalha tradicional."
          align="center"
        />

        {/* ========================================================== */}
        {/* SERVIÇOS & PREÇOS (COM FOTOS EM MINIATURA & TRANSIÇÕES) */}
        {/* ========================================================== */}
        <section id="servicos" className="py-20 bg-[#0E1015]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Tabela Oficial
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF]">
                Serviços & Preços
              </h2>
              <p className="text-sm text-[#B8B5AE]">
                Toque em qualquer serviço abaixo para já escolher o seu barbeiro e horário.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {servicos.map((serv, index) => {
                const fotoMiniatura = getServiceImage(serv.nome);

                return (
                  <ScrollReveal key={serv.id} delay={index * 50} direction="up">
                    <Link
                      href={`/agendamento?servico=${serv.id}`}
                      className="group p-4 sm:p-5 rounded-2xl bg-[#141720] border border-[#232733] hover:border-[#D4AF37] hover:bg-[#181C27] transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/15 hover:-translate-y-1"
                    >
                      {/* Miniatura do Serviço + Textos */}
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        {/* Foto em Miniatura com zoom no hover */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#1D212E] border border-[#2B3042] group-hover:border-[#D4AF37] flex-shrink-0 shadow-md transition-colors">
                          <Image
                            src={fotoMiniatura}
                            alt={serv.nome}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>

                        {/* Textos */}
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm sm:text-base text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors truncate">
                              {serv.nome}
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1D212B] text-[#B8B5AE] border border-[#282D3E]">
                              {serv.categoria}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#8E8B82]">
                            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{serv.duracao_min} minutos</span>
                          </div>
                        </div>
                      </div>

                      {/* Preço e Botão */}
                      <div className="text-right flex-shrink-0 flex items-center gap-2.5 sm:gap-3">
                        <div>
                          <span className="block text-lg sm:text-xl font-bold font-serif text-[#D4AF37]">
                            R$ {serv.preco.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#B8B5AE] group-hover:text-[#F5F3EF] transition-colors">
                            Escolher Barbeiro
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#8E8B82] group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* CONHEÇA O AMBIENTE & GALERIA COM CARROSSEL DE FOTOS */}
        {/* ========================================================== */}
        <section id="galeria" className="py-20 bg-[#0B0C0E] border-t border-[#1C1F2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <ScrollReveal direction="left" className="space-y-6">
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
                    <span>Geladeira abastecida com refrigerantes e cervejas bem gelados</span>
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
              </ScrollReveal>

              {/* Carrossel Interativo com as Fotos da Barbearia */}
              <ScrollReveal direction="right" delay={150}>
                <GaleriaCarousel />
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* LOCALIZAÇÃO E CONTATO */}
        {/* ========================================================== */}
        <section id="contato" className="py-20 bg-[#0E1015] border-t border-[#1C1F2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Como Chegar
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F3EF]">
                Venha nos Visitar
              </h2>
              <p className="text-sm text-[#B8B5AE]">
                Fácil acesso em Poá/SP com estacionamento na região.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Infos */}
              <ScrollReveal direction="left" className="space-y-6 bg-[#13161F] p-6 rounded-2xl border border-[#252836]">
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
              </ScrollReveal>

              {/* Mapa Embed */}
              <ScrollReveal direction="right" delay={150} className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#252836] shadow-xl min-h-[300px]">
                <iframe
                  title="Localização Barbearia Val"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.409383637682!2d-46.347895!3d-23.553755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce7b1e4f4d2f07%3A0x6b44a30e8c7857b7!2sAv.%20Adutora%2C%20530%20-%20Jardim%20Nova%20Po%C3%A1%2C%20Po%C3%A1%20-%20SP%2C%2008568-300!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                  width="100%"
                  height="100%"
                  className="w-full h-full min-h-[350px] border-0 grayscale contrast-125 opacity-90"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </ScrollReveal>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
