import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GaleriaCarousel from '@/components/GaleriaCarousel';
import ScrollReveal from '@/components/ScrollReveal';
import Barber3DTransition from '@/components/Barber3DTransition';
import ThreeSceneWrapper from '@/components/ThreeSceneWrapper';
import Card3D from '@/components/Card3D';
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
  Award,
  Layers,
  Compass
} from 'lucide-react';
import { getServicos, getBarbeiros } from '@/lib/repository';

export default async function HomePage() {
  const servicos = await getServicos();
  const barbeiros = await getBarbeiros();

  return (
    <>
      <Navbar />

      {/* ========================================================== */}
      {/* 3D WEBGL AMBIENT SCENE (AETHER & INFINIT PAPERS STYLE)     */}
      {/* Câmera orbital, anéis de ouro cinéticos e poeira espacial  */}
      {/* ========================================================== */}
      <ThreeSceneWrapper />

      <main className="flex-grow relative z-10">
        
        {/* ========================================================== */}
        {/* HERO SECTION VINTAGE EM PERSPECTIVA 3D                    */}
        {/* ========================================================== */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
          {/* Subtle background glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/12 rounded-full blur-[160px] pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
            
            {/* Top Badge */}
            <ScrollReveal direction="down">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D27]/90 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest shadow-[0_4px_20px_rgba(212,175,55,0.2)]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                Barbearia Clássica Anos 50 em Poá - SP
              </div>
            </ScrollReveal>

            {/* Main Title & Brand Graphic with 3D Depth */}
            <div className="space-y-4">
              <ScrollReveal direction="zoom" delay={100}>
                <div className="flex justify-center mb-2">
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-4 bg-[#D4AF37]/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <Image
                      src="/images/bigode.png"
                      alt="Bigode Clássico"
                      width={150}
                      height={48}
                      className="relative opacity-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={150}>
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#F5F3EF] drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
                  BARBEARIA <span className="vintage-text-gold">VAL</span>
                </h1>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={250}>
                <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#D1CEC7] leading-relaxed drop-shadow-md">
                  Mais do que um corte, uma experiência de respeito e tradição. Sala de espera aconchegante, bebidas geladas e técnicas impecáveis na tesoura e navalha.
                </p>
              </ScrollReveal>

              {/* Botão de Agendamento Imediato no Hero */}
              <ScrollReveal direction="up" delay={300} className="pt-2">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/agendamento"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C49B27] text-[#0A0B0E] font-bold text-sm uppercase tracking-wider shadow-[0_10px_35px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar Meu Horário Agora</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#servicos"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#141720]/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5F3EF] hover:text-[#D4AF37] font-semibold text-sm transition-all duration-300 hover:border-[#D4AF37]"
                  >
                    <span>Ver Tabela de Preços</span>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Highlights em Cards 3D */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <ScrollReveal delay={350} direction="up">
                <Card3D maxTilt={10} depth={15} className="rounded-xl h-full">
                  <div className="p-4 rounded-xl bg-[#13151D]/90 backdrop-blur-md border border-[#232733] hover:border-[#D4AF37]/50 flex items-center gap-3 h-full">
                    <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shadow-inner">
                      <Beer className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F5F3EF]">Bebidas Geladas</h4>
                      <p className="text-[11px] text-[#A6A298]">Refrigerantes & cervejas</p>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>

              <ScrollReveal delay={400} direction="up">
                <Card3D maxTilt={10} depth={15} className="rounded-xl h-full">
                  <div className="p-4 rounded-xl bg-[#13151D]/90 backdrop-blur-md border border-[#232733] hover:border-[#D4AF37]/50 flex items-center gap-3 h-full">
                    <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shadow-inner">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F5F3EF]">Sem Filas</h4>
                      <p className="text-[11px] text-[#A6A298]">Agendamento 100% online</p>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>

              <ScrollReveal delay={450} direction="up">
                <Card3D maxTilt={10} depth={15} className="rounded-xl h-full">
                  <div className="p-4 rounded-xl bg-[#13151D]/90 backdrop-blur-md border border-[#232733] hover:border-[#D4AF37]/50 flex items-center gap-3 h-full">
                    <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shadow-inner">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F5F3EF]">Estilo Anos 50</h4>
                      <p className="text-[11px] text-[#A6A298]">Barbearia clássica vintage</p>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>
            </div>

          </div>
        </section>

        {/* ========================================================== */}
        {/* TRANSIÇÃO 3D #1: TESOURAS VINTAGE DE OURO EM ESPAÇO 3D    */}
        {/* ========================================================== */}
        <Barber3DTransition
          type="scissors"
          tag="Arte & Tradição"
          title="Precisão em Cada Detalhe"
          subtitle="Do corte clássico na tesoura ao degradê moderno com acabamento impecável."
          align="right"
        />

        {/* ========================================================== */}
        {/* SOBRE NÓS - APRESENTAÇÃO DA BARBEARIA                      */}
        {/* ========================================================== */}
        <section id="sobre" className="py-20 bg-[#0D0F14]/85 backdrop-blur-sm border-t border-[#1C1F2A]/60">
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

              {/* Destaques da Identidade da Barbearia em Cards 3D */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                <ScrollReveal delay={100} direction="right">
                  <Card3D maxTilt={12} depth={15} className="rounded-2xl">
                    <div className="p-5 rounded-2xl bg-[#13161F]/90 backdrop-blur-md border border-[#242836] hover:border-[#D4AF37]/50 transition-all flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
                        <Scissors className="w-6 h-6" />
                      </div>
                      <div style={{ transform: 'translateZ(15px)' }}>
                        <h3 className="font-serif text-lg font-bold text-[#F5F3EF]">Excelência nos Detalhes</h3>
                        <p className="text-xs text-[#B8B5AE] mt-1 leading-relaxed">
                          Do corte tradicional ao fade moderno e platinado, com acabamento impecável na navalha.
                        </p>
                      </div>
                    </div>
                  </Card3D>
                </ScrollReveal>

                <ScrollReveal delay={200} direction="right">
                  <Card3D maxTilt={12} depth={15} className="rounded-2xl">
                    <div className="p-5 rounded-2xl bg-[#13161F]/90 backdrop-blur-md border border-[#242836] hover:border-[#D4AF37]/50 transition-all flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
                        <Beer className="w-6 h-6" />
                      </div>
                      <div style={{ transform: 'translateZ(15px)' }}>
                        <h3 className="font-serif text-lg font-bold text-[#F5F3EF]">Lazer & Conforto</h3>
                        <p className="text-xs text-[#B8B5AE] mt-1 leading-relaxed">
                          Sala de espera espaçosa e acolhedora, com refrigerantes e cervejas sempre à temperatura ideal.
                        </p>
                      </div>
                    </div>
                  </Card3D>
                </ScrollReveal>

                <ScrollReveal delay={300} direction="right">
                  <Card3D maxTilt={12} depth={15} className="rounded-2xl">
                    <div className="p-5 rounded-2xl bg-[#13161F]/90 backdrop-blur-md border border-[#242836] hover:border-[#D4AF37]/50 transition-all flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div style={{ transform: 'translateZ(15px)' }}>
                        <h3 className="font-serif text-lg font-bold text-[#F5F3EF]">Para Todas as Gerações</h3>
                        <p className="text-xs text-[#B8B5AE] mt-1 leading-relaxed">
                          Ambiente familiar e acolhedor que atende adultos e crianças com hora marcada e pontualidade.
                        </p>
                      </div>
                    </div>
                  </Card3D>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* TRANSIÇÃO 3D #2: BARBER POLE RETRÔ ILUMINADO              */}
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
        {/* NOSSOS BARBEIROS (VAL & HEITOR) - CARDS 3D INTERATIVOS     */}
        {/* ========================================================== */}
        <section id="barbeiros" className="py-20 bg-[#0B0C0F]/85 backdrop-blur-sm border-t border-[#1C1F2A]/60">
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
              
              {/* Card 3D Val */}
              <ScrollReveal delay={100} direction="left">
                <Card3D maxTilt={14} glareOpacity={0.28} depth={20} className="rounded-2xl h-full">
                  <div className="group bg-[#13161F]/95 backdrop-blur-md border border-[#262B3A] hover:border-[#D4AF37] rounded-2xl p-6 transition-all duration-300 shadow-xl h-full flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                      <div 
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#1D212E] border-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] flex-shrink-0 shadow-[0_12px_24px_rgba(0,0,0,0.8)] transition-all"
                        style={{ transform: 'translateZ(30px)' }}
                      >
                        <Image
                          src="/images/barbeiro-val.jpg"
                          alt="Mestre Barbeiro Val"
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-2.5 text-center sm:text-left flex-grow" style={{ transform: 'translateZ(20px)' }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="font-serif text-2xl font-bold text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors">
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

                    <div className="mt-5 pt-4 border-t border-[#1F2330] flex items-center justify-between" style={{ transform: 'translateZ(25px)' }}>
                      <span className="text-xs text-[#8E8B82]">Atendimento de Terça a Domingo</span>
                      <Link
                        href={`/agendamento?barbeiro=${barbeiros.find(b => b.nome.toLowerCase().includes('val'))?.id || ''}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0A0B0E] border border-[#D4AF37]/40 text-xs font-bold transition-all"
                      >
                        <span>Agendar com Val</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>

              {/* Card 3D Heitor */}
              <ScrollReveal delay={200} direction="right">
                <Card3D maxTilt={14} glareOpacity={0.28} depth={20} className="rounded-2xl h-full">
                  <div className="group bg-[#13161F]/95 backdrop-blur-md border border-[#262B3A] hover:border-[#D4AF37] rounded-2xl p-6 transition-all duration-300 shadow-xl h-full flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                      <div 
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#1D212E] border-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] flex-shrink-0 shadow-[0_12px_24px_rgba(0,0,0,0.8)] transition-all"
                        style={{ transform: 'translateZ(30px)' }}
                      >
                        <Image
                          src="/images/barbeiro-heitor.jpg"
                          alt="Barbeiro Heitor"
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-2.5 text-center sm:text-left flex-grow" style={{ transform: 'translateZ(20px)' }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="font-serif text-2xl font-bold text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors">
                            Heitor
                          </h3>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                            Barbeiro & Colorista
                          </span>
                        </div>
                        <p className="text-xs text-[#B8B5AE] leading-relaxed">
                          Especialista em degradês modernos (Fade), barba alinhada, platinados, luzes e procedimentos químicos masculinos.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#1F2330] flex items-center justify-between" style={{ transform: 'translateZ(25px)' }}>
                      <span className="text-xs text-[#8E8B82]">Atendimento de Terça a Domingo</span>
                      <Link
                        href={`/agendamento?barbeiro=${barbeiros.find(b => b.nome.toLowerCase().includes('heitor'))?.id || ''}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0A0B0E] border border-[#D4AF37]/40 text-xs font-bold transition-all"
                      >
                        <span>Agendar com Heitor</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* TRANSIÇÃO 3D #3: NAVALHA DAMASCO COM DETALHES DE OURO      */}
        {/* ========================================================== */}
        <Barber3DTransition
          type="razor"
          tag="Barboterapia & Navalha"
          title="Alinhamento e Acabamento Impecável"
          subtitle="Toalha quente, produtos premium e a precisão da navalha tradicional."
          align="center"
        />

        {/* ========================================================== */}
        {/* SERVIÇOS & PREÇOS (COM FOTOS EM MINIATURA & CARDS 3D)      */}
        {/* Alche & Aether Style: 3D Tilt, Glare, Z-Depth              */}
        {/* ========================================================== */}
        <section id="servicos" className="py-20 bg-[#0E1015]/85 backdrop-blur-sm border-t border-[#1C1F2A]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B26] border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Tabela Oficial de Serviços
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F3EF]">
                Serviços & Preços
              </h2>
              <p className="text-sm text-[#B8B5AE]">
                Toque em qualquer serviço abaixo para escolher seu barbeiro e horário.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {servicos.map((serv, index) => {
                const fotoMiniatura = getServiceImage(serv.nome);

                return (
                  <ScrollReveal key={serv.id} delay={index * 40} direction="up">
                    <Card3D
                      maxTilt={12}
                      glareOpacity={0.3}
                      scaleOnHover={1.03}
                      depth={20}
                      className="rounded-2xl h-full"
                    >
                      <Link
                        href={`/agendamento?servico=${serv.id}`}
                        className="group p-4 sm:p-5 rounded-2xl bg-[#141720]/90 backdrop-blur-md border border-[#232733] hover:border-[#D4AF37] hover:bg-[#181C27] transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/20 h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Miniatura do Serviço 3D + Textos */}
                        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0" style={{ transform: 'translateZ(25px)' }}>
                          {/* Foto em Miniatura com moldura de ouro, relevo e reflexo */}
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#1D212E] border-2 border-[#2B3042] group-hover:border-[#D4AF37] flex-shrink-0 shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:shadow-[0_14px_28px_rgba(212,175,55,0.35)] transition-all duration-300">
                            <Image
                              src={fotoMiniatura}
                              alt={serv.nome}
                              fill
                              className="object-cover group-hover:scale-115 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity duration-300"></div>
                            {/* Reflexo de vidro 3D */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                          </div>

                          {/* Textos com relevo espacial */}
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

                        {/* Preço e Botão em alto relevo Z */}
                        <div className="text-right flex-shrink-0 flex items-center gap-2.5 sm:gap-3" style={{ transform: 'translateZ(35px)' }}>
                          <div>
                            <span className="block text-lg sm:text-xl font-bold font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
                              R$ {serv.preco.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#B8B5AE] group-hover:text-[#F5F3EF] transition-colors">
                              Escolher Barbeiro
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#8E8B82] group-hover:text-[#D4AF37] group-hover:translate-x-1.5 transition-all" />
                        </div>
                      </Link>
                    </Card3D>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* CONHEÇA O AMBIENTE & GALERIA COM CARROSSEL DE FOTOS        */}
        {/* ========================================================== */}
        <section id="galeria" className="py-20 bg-[#0B0C0E]/85 backdrop-blur-sm border-t border-[#1C1F2A]/60">
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
                  A Barbearia Val foi projetada para quem valoriza o cuidado pessoal sem abrir mão do conforto e de uma boa conversa. Navegue pelas fotos ao lado para conhecer cada detalhe do nosso espaço:
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

              {/* Carrossel Interativo com as Fotos da Barbearia em Card 3D */}
              <ScrollReveal direction="right" delay={150}>
                <Card3D maxTilt={8} glareOpacity={0.2} depth={15} className="rounded-2xl">
                  <GaleriaCarousel />
                </Card3D>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* LOCALIZAÇÃO E CONTATO                                     */}
        {/* ========================================================== */}
        <section id="contato" className="py-20 bg-[#0E1015]/85 backdrop-blur-sm border-t border-[#1C1F2A]/60">
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
              
              {/* Infos em Card 3D */}
              <ScrollReveal direction="left">
                <Card3D maxTilt={10} depth={15} className="rounded-2xl h-full">
                  <div className="space-y-6 bg-[#13161F]/90 backdrop-blur-md p-6 rounded-2xl border border-[#252836] h-full flex flex-col justify-between">
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
                </Card3D>
              </ScrollReveal>

              {/* Mapa Embed em Card 3D */}
              <ScrollReveal direction="right" delay={150} className="lg:col-span-2">
                <Card3D maxTilt={6} depth={10} className="rounded-2xl h-full overflow-hidden">
                  <div className="rounded-2xl overflow-hidden border border-[#252836] shadow-xl min-h-[350px] h-full">
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
                </Card3D>
              </ScrollReveal>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
