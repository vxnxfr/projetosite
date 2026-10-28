'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Scissors, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Phone, 
  Sparkles,
  CalendarCheck,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  CalendarPlus,
  Mail
} from 'lucide-react';
import { Barbeiro, Servico, SlotHorario, AgendamentoItem } from '@/lib/types';
import { getWhatsAppBarbeiro } from '@/lib/constants';
import { getServiceImage } from '@/lib/serviceImages';
import ThreeSceneWrapper from '@/components/ThreeSceneWrapper';
import Card3D from '@/components/Card3D';

export default function AgendamentoPage() {
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Dados carregados da API
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [horariosSlots, setHorariosSlots] = useState<SlotHorario[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);

  // Estado do Agendamento
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState<number | null>(null); // null = Sem preferência
  const [dataSelecionada, setDataSelecionada] = useState<string>(() => {
    // Data de hoje formatada YYYY-MM-DD em horário local
    const hoje = new Date();
    // Se for segunda (dia 1), seleciona amanhã terça
    if (hoje.getDay() === 1) {
      hoje.setDate(hoje.getDate() + 1);
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`;
  });
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>('');
  const [barbeiroDoSlot, setBarbeiroDoSlot] = useState<number | null>(null);

  // Dados do Cliente
  const [nomeCliente, setNomeCliente] = useState('');
  const [whatsappCliente, setWhatsappCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [observacao, setObservacao] = useState('');

  // Status de Envio e Resultado
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [agendamentoConcluido, setAgendamentoConcluido] = useState<AgendamentoItem | null>(null);

  // Carregar lista de Serviços e Barbeiros ao montar
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const [resServ, resBarb] = await Promise.all([
          fetch('/api/servicos'),
          fetch('/api/barbeiros')
        ]);
        if (resServ.ok && resBarb.ok) {
          const s = await resServ.json();
          const b = await resBarb.json();
          setServicos(s);
          setBarbeiros(b);

          // Verificar parâmetro na URL se veio de um link específico de serviço
          const params = new URLSearchParams(window.location.search);
          const servicoIdParam = params.get('servico');
          if (servicoIdParam) {
            const idNum = parseInt(servicoIdParam, 10);
            if (!isNaN(idNum) && s.some((item: Servico) => item.id === idNum)) {
              setServicosSelecionados([idNum]);
            }
          }
          const barbeiroIdParam = params.get('barbeiro');
          if (barbeiroIdParam) {
            const bIdNum = parseInt(barbeiroIdParam, 10);
            if (!isNaN(bIdNum) && b.some((item: Barbeiro) => item.id === bIdNum)) {
              setBarbeiroSelecionado(bIdNum);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      }
    }
    carregarDadosIniciais();
  }, []);

  // Calcular Duração Total e Valor Total dos serviços selecionados
  const { duracaoTotal, valorTotal } = useMemo(() => {
    let duracao = 0;
    let valor = 0;
    servicos.forEach(s => {
      if (servicosSelecionados.includes(s.id)) {
        duracao += s.duracao_min;
        valor += s.preco;
      }
    });
    return { duracaoTotal: duracao, valorTotal: valor };
  }, [servicos, servicosSelecionados]);

  // Buscar Horários Disponíveis sempre que Data, Barbeiro ou Serviços mudarem
  useEffect(() => {
    async function buscarHorarios() {
      if (!dataSelecionada || duracaoTotal === 0) {
        setHorariosSlots([]);
        setHorarioSelecionado('');
        return;
      }

      setCarregandoHorarios(true);

      try {
        let url = `/api/horarios?data=${dataSelecionada}&duracao=${duracaoTotal}`;
        if (barbeiroSelecionado !== null) {
          url += `&barbeiro_id=${barbeiroSelecionado}&barbeiroId=${barbeiroSelecionado}`;
        }
        url += `&_t=${Date.now()}`;

        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const slots: SlotHorario[] = await res.json();
          setHorariosSlots(slots);

          // Preserva o horário selecionado se ele ainda existir na lista de slots válidos
          setHorarioSelecionado(prev => {
            if (prev && slots.some(s => s.horario === prev)) {
              return prev;
            }
            return '';
          });
        } else {
          setHorariosSlots([]);
          setHorarioSelecionado('');
        }
      } catch (err) {
        console.error('Erro ao buscar horários:', err);
        setHorariosSlots([]);
      } finally {
        setCarregandoHorarios(false);
      }
    }

    // Só busca horários quando o usuário estiver no Passo 3 (Data & Horário)
    if (etapa === 3) {
      buscarHorarios();
    }
  }, [dataSelecionada, barbeiroSelecionado, duracaoTotal, etapa === 3]);

  // Alternar Seleção de Serviço (permite múltiplos)
  const toggleServico = (id: number) => {
    setServicosSelecionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Formatar Telefone / WhatsApp com máscara visual (XX) XXXXX-XXXX
  const handleWhatsappChange = (value: string) => {
    const raw = value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length <= 11) {
      if (raw.length > 2) {
        formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
      }
      if (raw.length > 7) {
        formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
      }
    } else {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    }
    setWhatsappCliente(formatted);
  };

  // Enviar Agendamento
  const handleFinalizarAgendamento = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      setErroEnvio('Por favor, volte ao Passo 3 e selecione um horário para o agendamento.');
      return;
    }

    setEnviando(true);
    setErroEnvio(null);

    // Envia no fuso horário local exato (YYYY-MM-DDTHH:mm:00) sem desvio UTC
    const dataHoraInicio = `${dataSelecionada}T${horarioSelecionado}:00`;

    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNome: nomeCliente,
          clienteWhatsapp: whatsappCliente,
          clienteEmail: emailCliente.trim() || undefined,
          barbeiroId: barbeiroSelecionado !== null ? barbeiroSelecionado : (barbeiroDoSlot || null),
          servicosIds: servicosSelecionados,
          dataHoraInicio,
          observacao
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Erro ao criar agendamento');
      }

      setAgendamentoConcluido(resData);
      setEtapa(5);
    } catch (err: any) {
      setErroEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F5F3EF] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black pb-28 relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* CENÁRIO 3D WEBGL EM TEMPO REAL NO FUNDO                        */}
      {/* Medalhão 3D oficial, poeira de ouro e rotação espacial        */}
      {/* ============================================================== */}
      <ThreeSceneWrapper />

      {/* Top Bar Navigation */}
      <header className="bg-[#12141A]/90 backdrop-blur-md border-b border-[#252834] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-[#B8B5AE] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-semibold uppercase tracking-wider">Voltar ao Início</span>
          </Link>

          <div className="text-center">
            <span className="font-serif text-base font-bold text-[#F5F3EF] block">Agendamento Online</span>
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold">Val Barbearia</span>
          </div>

          <div className="w-16 text-right text-xs font-bold text-[#D4AF37]">
            Passo {etapa}/5
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-[#181B24] h-1.5">
          <div 
            className="bg-[#D4AF37] h-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(212,175,55,0.7)]"
            style={{ width: `${(etapa / 5) * 100}%` }}
          />
        </div>
      </header>

      {/* Conteúdo Principal do Fluxo */}
      <main className="max-w-2xl mx-auto w-full px-4 py-6 flex-grow relative z-10">
        
        {/* ============================================================== */}
        {/* PASSO 1: ESCOLHER SERVIÇO(S) - CARDS 3D                       */}
        {/* ============================================================== */}
        {etapa === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B26]/90 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Passo 1 de 5 • Escolha o(s) Serviço(s)
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F3EF] mt-1">
                Escolha o(s) Serviço(s)
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B5AE] mt-1">
                Você pode selecionar mais de um serviço para o mesmo atendimento (ex: Corte + Barba).
              </p>
            </div>

            <div className="space-y-3.5">
              {servicos.map(s => {
                const isSelected = servicosSelecionados.includes(s.id);
                return (
                  <Card3D
                    key={s.id}
                    maxTilt={8}
                    glareOpacity={0.25}
                    depth={15}
                    className="rounded-2xl"
                  >
                    <div
                      onClick={() => toggleServico(s.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                        isSelected
                          ? 'bg-[#181C26]/95 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]/40'
                          : 'bg-[#13151D]/90 backdrop-blur-md border-[#242836] hover:border-[#D4AF37]/50'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0" style={{ transform: 'translateZ(20px)' }}>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                          isSelected 
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-sm' 
                            : 'border-[#3D4359]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Miniatura 3D com Relevo Z */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-[#2B3042] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                          <Image
                            src={getServiceImage(s.nome)}
                            alt={s.nome}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-[#F5F3EF] truncate">
                            {s.nome}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-[#8E8B82] mt-0.5">
                            <span className="text-[#D4AF37] font-medium">{s.categoria}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              {s.duracao_min} min
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
                        <span className="font-serif text-lg sm:text-xl font-bold text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]">
                          R$ {s.preco.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASSO 2: ESCOLHER BARBEIRO - CARDS 3D                          */}
        {/* ============================================================== */}
        {etapa === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B26]/90 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Passo 2 de 5 • Escolha o Barbeiro
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F3EF] mt-1">
                Escolha o Barbeiro
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B5AE] mt-1">
                Escolha seu barbeiro favorito ou deixe no modo automático para ver o maior número de horários vagos.
              </p>
            </div>

            {/* Resumo do(s) serviço(s) escolhido(s) */}
            {servicosSelecionados.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#141722]/90 backdrop-blur-md border border-[#282D3E] flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-[#8E8B82] block">Serviço selecionado:</span>
                  <span className="font-semibold text-[#D4AF37]">
                    {servicos.filter(s => servicosSelecionados.includes(s.id)).map(s => s.nome).join(' + ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="text-xs text-[#F5F3EF] hover:text-[#D4AF37] underline underline-offset-4 flex-shrink-0"
                >
                  Alterar / + Serviços
                </button>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Opção "Sem preferência" (Recomendada) em Card 3D */}
              <Card3D maxTilt={10} depth={15} className="rounded-2xl">
                <div
                  onClick={() => setBarbeiroSelecionado(null)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                    barbeiroSelecionado === null
                      ? 'bg-[#181C26]/95 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]/40'
                      : 'bg-[#13151D]/90 backdrop-blur-md border-[#242836] hover:border-[#D4AF37]/50'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="flex items-center gap-4" style={{ transform: 'translateZ(20px)' }}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                      barbeiroSelecionado === null 
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_4px_12px_rgba(212,175,55,0.4)]' 
                        : 'bg-[#1C202C] border-[#2E3345] text-[#D4AF37]'
                    }`}>
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-[#F5F3EF]">Sem preferência</h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          Mais horários disponíveis
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8B82] mt-0.5">
                        O sistema atribui quem tiver a agenda livre (Val ou Heitor).
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      barbeiroSelecionado === null ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#3A4057]'
                    }`}>
                      {barbeiroSelecionado === null && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                  </div>
                </div>
              </Card3D>

              {/* Barbeiros Cadastrados (Val & Heitor) em Cards 3D */}
              {barbeiros.map(b => {
                const isSelected = barbeiroSelecionado === b.id;
                return (
                  <Card3D key={b.id} maxTilt={12} depth={20} className="rounded-2xl">
                    <div
                      onClick={() => setBarbeiroSelecionado(b.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                        isSelected
                          ? 'bg-[#181C26]/95 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]/40'
                          : 'bg-[#13151D]/90 backdrop-blur-md border-[#242836] hover:border-[#D4AF37]/50'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center gap-4" style={{ transform: 'translateZ(20px)' }}>
                        <div className={`relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.7)] ${
                          isSelected 
                            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40' 
                            : 'border-[#2E3345]'
                        }`}>
                          <Image
                            src={b.foto_url || (b.nome.toLowerCase().includes('heitor') ? '/images/barbeiro-heitor.jpg' : '/images/barbeiro-val.jpg')}
                            alt={b.nome}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base text-[#F5F3EF]">{b.nome}</h3>
                          <p className="text-xs text-[#8E8B82] mt-0.5">{b.bio || 'Barbeiro Profissional'}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#3A4057]'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASSO 3: ESCOLHER DATA E HORÁRIO - CARDS 3D                    */}
        {/* ============================================================== */}
        {etapa === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B26]/90 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Passo 3 de 5 • Data & Horário
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F3EF] mt-1">
                Data e Horário
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B5AE] mt-1">
                Selecione o dia desejado para ver a disponibilidade em tempo real.
              </p>
            </div>

            {/* Input de Data em Card 3D */}
            <Card3D maxTilt={6} depth={10} className="rounded-2xl">
              <div className="bg-[#13151D]/90 backdrop-blur-md border border-[#242836] rounded-2xl p-5 space-y-2 shadow-lg" style={{ transformStyle: 'preserve-3d' }}>
                <label htmlFor="data-input" className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider" style={{ transform: 'translateZ(15px)' }}>
                  Escolha a Data:
                </label>
                <div style={{ transform: 'translateZ(20px)' }}>
                  <input
                    id="data-input"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={dataSelecionada}
                    onChange={e => setDataSelecionada(e.target.value)}
                    className="w-full bg-[#181B26] border border-[#2D3345] text-[#F5F3EF] px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-semibold transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#8E8B82]" style={{ transform: 'translateZ(10px)' }}>
                  * Barbearia aberta Terça a Sexta (9h-20h), Sábado (8h-20h), Domingo (8h-12h). Fechado às segundas.
                </p>
              </div>
            </Card3D>

            {/* Grade de Horários */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#B8B5AE] uppercase tracking-wider">
                  Horários Livres {barbeiroSelecionado ? `de ${barbeiros.find(b => b.id === barbeiroSelecionado)?.nome || ''}` : '(Val ou Heitor)'} ({horariosSlots.length})
                </span>
                {carregandoHorarios && (
                  <span className="text-xs text-[#D4AF37] animate-pulse">Atualizando agenda...</span>
                )}
              </div>

              {carregandoHorarios ? (
                <div className="py-12 text-center text-sm text-[#8E8B82] bg-[#13151D]/90 backdrop-blur-md border border-[#242836] rounded-2xl">
                  Consultando disponibilidade no banco...
                </div>
              ) : horariosSlots.length === 0 ? (
                <div className="py-10 text-center bg-[#13151D]/90 backdrop-blur-md border border-[#242836] rounded-2xl p-6 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-[#F5F3EF]">
                    Nenhum horário livre nesta data
                  </p>
                  <p className="text-xs text-[#8E8B82] max-w-sm mx-auto">
                    A barbearia pode estar fechada nesta data (ex: segundas-feiras) ou todos os horários deste barbeiro já foram preenchidos. Tente escolher outro dia ou o modo "Sem preferência".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {horariosSlots.map(slot => {
                    const isSelected = horarioSelecionado === slot.horario;
                    return (
                      <button
                        key={slot.horario}
                        type="button"
                        onClick={() => {
                          setHorarioSelecionado(slot.horario);
                          setBarbeiroDoSlot(slot.barbeiro_id || null);
                        }}
                        className={`py-3 px-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.35)] scale-[1.03] font-bold'
                            : 'bg-[#151821]/90 backdrop-blur-md text-[#F5F3EF] border-[#272B3A] hover:border-[#D4AF37]/60 hover:bg-[#1B1E29] hover:shadow-md'
                        }`}
                      >
                        <span className="font-semibold text-sm">{slot.horario}</span>
                        {slot.barbeiro_nome && (
                          <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-black/85 font-bold' : 'text-[#8E8B82]'}`}>
                            {slot.barbeiro_nome}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASSO 4: IDENTIFICAÇÃO (DADOS DO USUÁRIO) - CARD 3D            */}
        {/* ============================================================== */}
        {etapa === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B26]/90 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Passo 4 de 5 • Seus Dados
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F3EF] mt-1">
                Seus Dados
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B5AE] mt-1">
                Sem cadastros longos ou senhas. Apenas seu nome e WhatsApp para confirmar a reserva.
              </p>
            </div>

            {/* Resumo visual do horário escolhido com relevo */}
            <div className="p-4 rounded-xl bg-[#181B26]/90 backdrop-blur-md border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
              <div className="flex items-center gap-2 text-[#F5F3EF]">
                <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  <strong>Data:</strong> {dataSelecionada.split('-').reverse().join('/')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F3EF]">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  <strong>Horário:</strong> {horarioSelecionado || 'Nenhum horário selecionado'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F3EF]">
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  <strong>Barbeiro:</strong> {
                    barbeiroSelecionado 
                      ? (barbeiros.find(b => b.id === barbeiroSelecionado)?.nome || 'Específico') 
                      : barbeiroDoSlot 
                        ? `${barbeiros.find(b => b.id === barbeiroDoSlot)?.nome || 'Profissional'} (Automático)` 
                        : 'Sem preferência (Automático)'
                  }
                </span>
              </div>
            </div>

            {/* Card 3D do Formulário de Usuário */}
            <Card3D maxTilt={6} glareOpacity={0.2} depth={15} className="rounded-2xl">
              <div className="bg-[#13151D]/90 backdrop-blur-md border border-[#242836] rounded-2xl p-6 space-y-4 shadow-xl" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ transform: 'translateZ(15px)' }}>
                  <label htmlFor="nome-input" className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                    Seu Nome Completo: *
                  </label>
                  <input
                    id="nome-input"
                    type="text"
                    placeholder="Ex: João da Silva"
                    value={nomeCliente}
                    onChange={e => setNomeCliente(e.target.value)}
                    className="w-full bg-[#181B26] border border-[#2D3345] text-[#F5F3EF] px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm transition-colors"
                    autoFocus
                  />
                </div>

                <div style={{ transform: 'translateZ(15px)' }}>
                  <label htmlFor="whats-input" className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                    WhatsApp com DDD: *
                  </label>
                  <input
                    id="whats-input"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={whatsappCliente}
                    onChange={e => handleWhatsappChange(e.target.value)}
                    className="w-full bg-[#181B26] border border-[#2D3345] text-[#F5F3EF] px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-mono transition-colors"
                  />
                  <p className="text-[11px] text-[#8E8B82] mt-1">
                    Enviaremos o lembrete e a confirmação para este número.
                  </p>
                </div>

                <div style={{ transform: 'translateZ(15px)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="email-input" className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      E-mail para Confirmação & Calendário:
                    </label>
                    <span className="text-[10px] text-[#D4AF37] uppercase font-bold">Opcional / Recomendado</span>
                  </div>
                  <div className="relative">
                    <input
                      id="email-input"
                      type="email"
                      placeholder="seuemail@gmail.com"
                      value={emailCliente}
                      onChange={e => setEmailCliente(e.target.value)}
                      className="w-full bg-[#181B26] border border-[#2D3345] text-[#F5F3EF] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#8E8B82] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-[#8E8B82] mt-1">
                    Receba o comprovante oficial e o convite para adicionar automaticamente à sua agenda Google/Outlook.
                  </p>
                </div>

                <div style={{ transform: 'translateZ(15px)' }}>
                  <label htmlFor="obs-input" className="block text-xs font-semibold text-[#B8B5AE] uppercase tracking-wider mb-1.5">
                    Observações (Opcional):
                  </label>
                  <textarea
                    id="obs-input"
                    rows={2}
                    placeholder="Ex: Prefiro tesoura no topo / química recente..."
                    value={observacao}
                    onChange={e => setObservacao(e.target.value)}
                    className="w-full bg-[#181B26] border border-[#2D3345] text-[#F5F3EF] px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm transition-colors"
                  />
                </div>
              </div>
            </Card3D>

            {erroEnvio && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>{erroEnvio}</span>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PASSO 5: CONFIRMAÇÃO DO AGENDAMENTO - TICKET 3D DE LUXO        */}
        {/* ============================================================== */}
        {etapa === 5 && agendamentoConcluido && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Agendamento Confirmado!
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#F5F3EF] mt-1">
                Tudo pronto, {agendamentoConcluido.cliente_nome.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B5AE] mt-1">
                Seu horário foi reservado com sucesso no sistema da Barbearia Val.
              </p>
            </div>

            {/* Cartão de Resumo Oficial em 3D (Voucher / Ticket de Luxo) */}
            <Card3D maxTilt={10} glareOpacity={0.3} depth={25} className="rounded-2xl max-w-lg mx-auto">
              <div className="bg-[#13161F]/95 backdrop-blur-xl border-2 border-[#D4AF37]/50 rounded-2xl p-6 text-left space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)]" style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex justify-between items-center border-b border-[#252A38] pb-3" style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs text-[#8E8B82] uppercase font-semibold">Comprovante Oficial:</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#D4AF37]">#{agendamentoConcluido.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs" style={{ transform: 'translateZ(25px)' }}>
                  <div>
                    <span className="text-[#8E8B82] block">Barbeiro:</span>
                    <span className="text-sm font-bold text-[#F5F3EF]">{agendamentoConcluido.barbeiro_nome}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8B82] block">Horário:</span>
                    <span className="text-sm font-bold text-[#F5F3EF]">
                      {new Date(agendamentoConcluido.data_hora_inicio).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(agendamentoConcluido.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8E8B82] block">Duração Estimada:</span>
                    <span className="text-sm font-bold text-[#F5F3EF]">{agendamentoConcluido.duracao_total} minutos</span>
                  </div>
                  <div>
                    <span className="text-[#8E8B82] block">Valor Total:</span>
                    <span className="text-base font-serif font-bold text-[#D4AF37]">
                      R$ {agendamentoConcluido.valor_total?.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#252A38] pt-3" style={{ transform: 'translateZ(18px)' }}>
                  <span className="text-[#8E8B82] text-xs block mb-1">Serviço(s):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {agendamentoConcluido.servicos?.map(s => (
                      <span key={s.id} className="text-xs px-2.5 py-1 rounded-md bg-[#1D212D] border border-[#2B3042] text-[#F5F3EF]">
                        {s.nome}
                      </span>
                    ))}
                  </div>
                </div>

                {agendamentoConcluido.cliente_email && (
                  <div className="border-t border-[#252A38] pt-3 flex items-center gap-2.5 text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/40" style={{ transform: 'translateZ(20px)' }}>
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Comprovante e convite do Google Agenda enviados para: <strong>{agendamentoConcluido.cliente_email}</strong>
                    </span>
                  </div>
                )}
              </div>
            </Card3D>

            {/* Ações Especiais: Google Agenda & WhatsApp */}
            <div className="space-y-3 max-w-lg mx-auto pt-2">
              
              {/* Botão Google Agenda */}
              {agendamentoConcluido.google_calendar_url && (
                <a
                  href={agendamentoConcluido.google_calendar_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95"
                >
                  <CalendarPlus className="w-5 h-5" />
                  Adicionar ao Google Agenda (Lembrete Automático)
                </a>
              )}

              {/* Botão WhatsApp Barbeiro Específico */}
              {(() => {
                const infoBarbeiro = getWhatsAppBarbeiro(agendamentoConcluido.barbeiro_nome);
                const dataFormatada = new Date(agendamentoConcluido.data_hora_inicio).toLocaleDateString('pt-BR');
                const horaFormatada = new Date(agendamentoConcluido.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const servicosStr = agendamentoConcluido.servicos?.map(s => s.nome).join(' + ') || 'Corte';
                
                const mensagemWhats = [
                  `💈 *Novo Agendamento pelo Site - Barbearia Val*`,
                  `----------------------------------------`,
                  `✂️ *Barbeiro:* ${agendamentoConcluido.barbeiro_nome}`,
                  `👤 *Cliente:* ${agendamentoConcluido.cliente_nome}`,
                  `📱 *Telefone/WhatsApp:* ${agendamentoConcluido.cliente_whatsapp}`,
                  `📅 *Data:* ${dataFormatada}`,
                  `⏰ *Horário:* ${horaFormatada}`,
                  `📋 *Serviço(s):* ${servicosStr}`,
                  `⏱ *Duração estimada:* ${agendamentoConcluido.duracao_total} min`,
                  `💰 *Valor Total:* R$ ${agendamentoConcluido.valor_total?.toFixed(2).replace('.', ',')}`,
                  `🎫 *Código:* #${agendamentoConcluido.id}`,
                  `----------------------------------------`,
                  `📌 *Adicionar à sua Agenda do Google:*`,
                  agendamentoConcluido.google_calendar_url || ''
                ].filter(Boolean).join('\n');

                return (
                  <div className="space-y-1.5">
                    <a
                      href={`https://wa.me/${infoBarbeiro.numero}?text=${encodeURIComponent(mensagemWhats)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Enviar Confirmação para {agendamentoConcluido.barbeiro_nome} ({infoBarbeiro.display})
                    </a>
                    <p className="text-[11px] text-[#8E8B82]">
                      Identificado: Barbeiro <strong>{agendamentoConcluido.barbeiro_nome}</strong> no WhatsApp <strong>{infoBarbeiro.display}</strong>
                    </p>
                  </div>
                );
              })()}

              <Link
                href="/"
                className="inline-block pt-4 text-xs text-[#8E8B82] hover:text-[#D4AF37] transition-colors"
              >
                ← Voltar para a Página Inicial
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* BARRA INFERIOR FIXA DE RESUMO (STICKY ORDER SUMMARY) */}
      {/* ============================================================== */}
      {etapa < 5 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#12141C]/95 backdrop-blur-md border-t border-[#252836] p-4 shadow-2xl">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            
            {/* Resumo de Tempo e Preço */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37]">
                  R$ {valorTotal.toFixed(2).replace('.', ',')}
                </span>
                {duracaoTotal > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[#1D212B] text-[#B8B5AE] border border-[#2B3040]">
                    {duracaoTotal} min
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8E8B82]">
                {servicosSelecionados.length === 0
                  ? 'Selecione ao menos 1 serviço'
                  : `${servicosSelecionados.length} serviço(s) selecionado(s)`}
              </p>
            </div>

            {/* Botão de Avançar / Ação */}
            <div className="flex items-center gap-2">
              {etapa > 1 && (
                <button
                  type="button"
                  onClick={() => setEtapa((etapa - 1) as any)}
                  className="px-3 py-2.5 rounded-xl border border-[#2F3445] text-xs font-semibold hover:bg-[#1B1E28] transition-colors"
                >
                  Voltar
                </button>
              )}

              {etapa === 1 && (
                <button
                  type="button"
                  disabled={servicosSelecionados.length === 0}
                  onClick={() => setEtapa(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C05B] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {etapa === 2 && (
                <button
                  type="button"
                  onClick={() => setEtapa(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-bold text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {etapa === 3 && (
                <button
                  type="button"
                  disabled={!horarioSelecionado}
                  onClick={() => setEtapa(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C05B] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {etapa === 4 && (
                <button
                  type="button"
                  disabled={enviando || !nomeCliente.trim() || whatsappCliente.replace(/\D/g, '').length < 10 || !horarioSelecionado}
                  onClick={handleFinalizarAgendamento}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C05B] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  {enviando ? 'Confirmando...' : 'Finalizar Agendamento'}
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
