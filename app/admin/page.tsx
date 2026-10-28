'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft,
  CalendarPlus,
  MessageCircle,
  Filter,
  Lock,
  Unlock,
  Trash2,
  Plus,
  Send,
  Bot,
  Mail,
  Check,
  ExternalLink
} from 'lucide-react';
import { AgendamentoItem, Barbeiro, BloqueioItem } from '@/lib/types';
import { getWhatsAppBarbeiro } from '@/lib/constants';

export default function AdminPage() {
  const [abaAtiva, setAbaAtiva] = useState<'agendamentos' | 'bloqueios' | 'lembretes'>('agendamentos');

  // Estados dos Agendamentos
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [filtroBarbeiro, setFiltroBarbeiro] = useState<string>('todos');
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados dos Bloqueios / Horários Travados
  const [bloqueios, setBloqueios] = useState<BloqueioItem[]>([]);
  const [carregandoBloqueios, setCarregandoBloqueios] = useState<boolean>(false);
  const [bloqueioBarbeiroId, setBloqueioBarbeiroId] = useState<string>('todos');
  const [bloqueioInicio, setBloqueioInicio] = useState<string>('');
  const [bloqueioFim, setBloqueioFim] = useState<string>('');
  const [bloqueioMotivo, setBloqueioMotivo] = useState<string>('Horário travado pelo barbeiro');
  const [salvandoBloqueio, setSalvandoBloqueio] = useState<boolean>(false);
  const [msgBloqueio, setMsgBloqueio] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Estados do Bot de Lembretes WhatsApp
  const [lembretes, setLembretes] = useState<any[]>([]);
  const [carregandoLembretes, setCarregandoLembretes] = useState<boolean>(false);
  const [disparandoLembretes, setDisparandoLembretes] = useState<boolean>(false);
  const [dataLembreteFiltro, setDataLembreteFiltro] = useState<string>(() => {
    const hoje = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`;
  });
  const [resumoDisparo, setResumoDisparo] = useState<{ total: number; enviados: number; falhas: number } | null>(null);

  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'val-admin-2026',
  };

  // -------------------------------------------------------------------
  // CARREGAR DADOS
  // -------------------------------------------------------------------
  const carregarAgendamentos = () => {
    setCarregando(true);
    const url = filtroBarbeiro === 'todos' 
      ? '/api/admin/agendamentos' 
      : `/api/admin/agendamentos?barbeiroId=${filtroBarbeiro}`;

    fetch(url, { headers: adminHeaders, cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAgendamentos(data);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  };

  const carregarBloqueios = () => {
    setCarregandoBloqueios(true);
    fetch('/api/admin/bloqueios', { headers: adminHeaders, cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBloqueios(data);
      })
      .catch(console.error)
      .finally(() => setCarregandoBloqueios(false));
  };

  const carregarLembretes = () => {
    setCarregandoLembretes(true);
    fetch(`/api/cron/lembretes?data=${dataLembreteFiltro}`, { headers: adminHeaders, cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLembretes(data);
      })
      .catch(console.error)
      .finally(() => setCarregandoLembretes(false));
  };

  useEffect(() => {
    fetch('/api/barbeiros')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBarbeiros(data);
      });
  }, []);

  useEffect(() => {
    carregarAgendamentos();
  }, [filtroBarbeiro]);

  useEffect(() => {
    if (abaAtiva === 'bloqueios') {
      carregarBloqueios();
    } else if (abaAtiva === 'lembretes') {
      carregarLembretes();
    }
  }, [abaAtiva, dataLembreteFiltro]);

  // -------------------------------------------------------------------
  // AÇÕES AGENDAMENTOS
  // -------------------------------------------------------------------
  const handleMudarStatus = async (id: number, novoStatus: string) => {
    try {
      const res = await fetch('/api/admin/agendamentos', {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({ id, status: novoStatus })
      });
      if (res.ok) {
        setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: novoStatus as any } : a));
      }
    } catch (e) {
      console.error('Erro ao atualizar status:', e);
    }
  };

  // -------------------------------------------------------------------
  // AÇÕES BLOQUEIOS / TRAVAR HORÁRIO
  // -------------------------------------------------------------------
  const handleCriarBloqueio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloqueioInicio || !bloqueioFim) {
      setMsgBloqueio({ tipo: 'erro', texto: 'Informe a data/hora de início e de término do bloqueio.' });
      return;
    }

    setSalvandoBloqueio(true);
    setMsgBloqueio(null);

    try {
      const res = await fetch('/api/admin/bloqueios', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          barbeiroId: bloqueioBarbeiroId === 'todos' ? null : Number(bloqueioBarbeiroId),
          dataHoraInicio: bloqueioInicio.replace('T', ' '),
          dataHoraFim: bloqueioFim.replace('T', ' '),
          motivo: bloqueioMotivo
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar bloqueio');
      }

      setMsgBloqueio({ tipo: 'sucesso', texto: 'Horário bloqueado com sucesso! Não estará mais disponível para agendamento.' });
      setBloqueioInicio('');
      setBloqueioFim('');
      carregarBloqueios();
    } catch (err: any) {
      setMsgBloqueio({ tipo: 'erro', texto: err.message });
    } finally {
      setSalvandoBloqueio(false);
    }
  };

  const handleRemoverBloqueio = async (id: number) => {
    if (!confirm('Deseja realmente desbloquear este horário?')) return;

    try {
      const res = await fetch(`/api/admin/bloqueios?id=${id}`, {
        method: 'DELETE',
        headers: adminHeaders
      });

      if (res.ok) {
        setBloqueios(prev => prev.filter(b => b.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Falha ao remover bloqueio');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -------------------------------------------------------------------
  // AÇÕES BOT DE WHATSAPP
  // -------------------------------------------------------------------
  const handleDispararTodosLembretes = async () => {
    if (!confirm(`Deseja disparar os lembretes do dia ${dataLembreteFiltro.split('-').reverse().join('/')} para ${lembretes.length} cliente(s)?`)) {
      return;
    }

    setDisparandoLembretes(true);
    setResumoDisparo(null);

    try {
      const res = await fetch('/api/cron/lembretes', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ data: dataLembreteFiltro })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao disparar lembretes');
      }

      setResumoDisparo({
        total: data.total,
        enviados: data.enviados,
        falhas: data.falhas
      });
      carregarLembretes();
    } catch (err: any) {
      alert('Erro no disparo: ' + err.message);
    } finally {
      setDisparandoLembretes(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F5F3EF]">
      {/* Header */}
      <header className="bg-[#12141C] border-b border-[#252836] p-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg bg-[#181B26] text-[#B8B5AE] hover:text-[#D4AF37] border border-[#262B3A]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#F5F3EF]">Painel Barbearia Val</h1>
              <p className="text-xs text-[#8E8B82]">Agenda, Gestão de Bloqueios e Bot WhatsApp</p>
            </div>
          </div>

          {/* Abas Superiores */}
          <div className="flex items-center gap-1.5 bg-[#181B26] p-1 rounded-xl border border-[#2B3042] text-xs">
            <button
              onClick={() => setAbaAtiva('agendamentos')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                abaAtiva === 'agendamentos'
                  ? 'bg-[#D4AF37] text-black shadow'
                  : 'text-[#B8B5AE] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Agendamentos ({agendamentos.length})
            </button>

            <button
              onClick={() => setAbaAtiva('bloqueios')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                abaAtiva === 'bloqueios'
                  ? 'bg-[#D4AF37] text-black shadow'
                  : 'text-[#B8B5AE] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Travar Horários ({bloqueios.length})
            </button>

            <button
              onClick={() => setAbaAtiva('lembretes')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                abaAtiva === 'lembretes'
                  ? 'bg-[#D4AF37] text-black shadow'
                  : 'text-[#B8B5AE] hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Bot WhatsApp ({lembretes.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        
        {/* ============================================================== */}
        {/* ABA 1: AGENDAMENTOS */}
        {/* ============================================================== */}
        {abaAtiva === 'agendamentos' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-sm uppercase tracking-wider font-bold text-[#D4AF37]">
                Agendamentos Registrados ({agendamentos.length})
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-[#181B26] border border-[#2B3042] rounded-lg px-3 py-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <select
                    value={filtroBarbeiro}
                    onChange={e => setFiltroBarbeiro(e.target.value)}
                    className="bg-transparent text-[#F5F3EF] focus:outline-none cursor-pointer"
                  >
                    <option value="todos" className="bg-[#181B26]">Todos os Barbeiros</option>
                    {barbeiros.map(b => (
                      <option key={b.id} value={b.id} className="bg-[#181B26]">{b.nome}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={carregarAgendamentos}
                  className="p-2 rounded-lg bg-[#181B26] text-[#D4AF37] border border-[#2B3042] hover:bg-[#202433] transition-colors"
                  title="Recarregar"
                >
                  <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {carregando ? (
              <div className="py-20 text-center text-sm text-[#8E8B82]">
                Carregando agendamentos...
              </div>
            ) : agendamentos.length === 0 ? (
              <div className="py-16 text-center bg-[#13151D] border border-[#242836] rounded-2xl p-8 space-y-3">
                <Calendar className="w-12 h-12 text-[#D4AF37]/50 mx-auto" />
                <h3 className="text-base font-semibold text-[#F5F3EF]">Nenhum agendamento encontrado</h3>
                <p className="text-xs text-[#8E8B82]">Faça um novo agendamento na página do site para testar o sistema.</p>
                <Link
                  href="/agendamento"
                  className="inline-block mt-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-bold"
                >
                  Fazer Agendamento de Teste
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {agendamentos.map(item => {
                  const dataIni = new Date(item.data_hora_inicio);
                  const dataFormatada = dataIni.toLocaleDateString('pt-BR');
                  const horaFormatada = dataIni.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={item.id}
                      className="bg-[#13161F] border border-[#232733] hover:border-[#383E54] rounded-xl p-4 sm:p-5 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#202432] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-md">
                            #{item.id}
                          </span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold text-[#F5F3EF]">
                              {dataFormatada} às {horaFormatada}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8E8B82]">Barbeiro:</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1C202C] text-[#F5F3EF] border border-[#2B3042]">
                            {item.barbeiro_nome}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            item.status === 'Confirmado' ? 'bg-emerald-500/20 text-emerald-400' :
                            item.status === 'Concluído' ? 'bg-blue-500/20 text-blue-400' :
                            item.status === 'Cancelado' ? 'bg-red-500/20 text-red-400' :
                            item.status === 'Faltou' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Informações do Cliente */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[#8E8B82] block">Cliente:</span>
                          <span className="font-semibold text-sm text-[#F5F3EF]">{item.cliente_nome}</span>
                        </div>
                        <div>
                          <span className="text-[#8E8B82] block">WhatsApp:</span>
                          <span className="font-mono font-semibold text-[#D4AF37]">{item.cliente_whatsapp}</span>
                        </div>
                        {item.cliente_email && (
                          <div>
                            <span className="text-[#8E8B82] block">E-mail:</span>
                            <span className="text-[#B8B5AE] font-mono flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#D4AF37]" />
                              {item.cliente_email}
                            </span>
                          </div>
                        )}
                        {item.observacao && (
                          <div className="sm:col-span-2 md:col-span-3">
                            <span className="text-[#8E8B82] block">Observações:</span>
                            <span className="text-[#B8B5AE] italic">{item.observacao}</span>
                          </div>
                        )}
                      </div>

                      {/* Botões de Ação */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Adicionar ao Google Agenda */}
                          {item.google_calendar_url && (
                            <a
                              href={item.google_calendar_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#1A73E8]/20 hover:bg-[#1A73E8]/30 border border-[#1A73E8]/50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <CalendarPlus className="w-3.5 h-3.5 text-[#4285F4]" />
                              Salvar no Google Agenda
                            </a>
                          )}

                          {/* WhatsApp do Barbeiro */}
                          {(() => {
                            const contatoBarbeiro = getWhatsAppBarbeiro(item.barbeiro_nome);
                            const msgBarbeiro = `💈 *Lembrete de Atendimento - Barbearia Val*\n\n✂️ *Barbeiro:* ${item.barbeiro_nome}\n👤 *Cliente:* ${item.cliente_nome}\n📱 *Tel:* ${item.cliente_whatsapp}\n📅 *Data:* ${dataFormatada} às ${horaFormatada}\n🎫 *Código:* #${item.id}\n\n📌 *Google Agenda:* ${item.google_calendar_url || ''}`;
                            return (
                              <a
                                href={`https://wa.me/${contatoBarbeiro.numero}?text=${encodeURIComponent(msgBarbeiro)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                                Avisar {item.barbeiro_nome} ({contatoBarbeiro.display})
                              </a>
                            );
                          })()}

                          {/* Conversar com Cliente no WhatsApp */}
                          <a
                            href={`https://wa.me/55${item.cliente_whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(item.cliente_nome)},%20aqui%20%C3%A9%20da%20Barbearia%20Val!%20Confirmando%20seu%20agendamento%20para%20${encodeURIComponent(dataFormatada)}%20%C3%A0s%20${encodeURIComponent(horaFormatada)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            WhatsApp do Cliente
                          </a>
                        </div>

                        {/* Mudar Status */}
                        <div className="flex items-center gap-1">
                          {item.status !== 'Confirmado' && (
                            <button
                              onClick={() => handleMudarStatus(item.id, 'Confirmado')}
                              className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 text-[11px] font-semibold"
                            >
                              Confirmar
                            </button>
                          )}
                          {item.status !== 'Concluído' && (
                            <button
                              onClick={() => handleMudarStatus(item.id, 'Concluído')}
                              className="px-2.5 py-1 rounded bg-blue-950/60 text-blue-400 hover:bg-blue-900 border border-blue-800 text-[11px] font-semibold"
                            >
                              Concluir
                            </button>
                          )}
                          {item.status !== 'Cancelado' && (
                            <button
                              onClick={() => handleMudarStatus(item.id, 'Cancelado')}
                              className="px-2.5 py-1 rounded bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-800 text-[11px] font-semibold"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 2: TRAVAR HORÁRIOS NA AGENDA (BLOQUEIOS) */}
        {/* ============================================================== */}
        {abaAtiva === 'bloqueios' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm uppercase tracking-wider font-bold text-[#D4AF37]">
                Travar Horários na Agenda
              </h2>
              <p className="text-xs text-[#8E8B82] mt-1">
                Bloqueie horários para almoço, folgas, compromissos pessoais ou manutenções. Os horários bloqueados não aparecerão disponíveis para agendamento dos clientes.
              </p>
            </div>

            {/* Formulário de Criação de Bloqueio */}
            <form onSubmit={handleCriarBloqueio} className="bg-[#13161F] border border-[#252A38] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F5F3EF] border-b border-[#232734] pb-2">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>Novo Bloqueio de Horário</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* Seleção do Barbeiro */}
                <div>
                  <label className="block text-[#8E8B82] mb-1 font-semibold">Barbeiro Afetado:</label>
                  <select
                    value={bloqueioBarbeiroId}
                    onChange={e => setBloqueioBarbeiroId(e.target.value)}
                    className="w-full bg-[#181B26] border border-[#2B3042] text-[#F5F3EF] p-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="todos">Todos os Barbeiros (Barbearia Fechada)</option>
                    {barbeiros.map(b => (
                      <option key={b.id} value={b.id}>{b.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Data e Hora Início */}
                <div>
                  <label className="block text-[#8E8B82] mb-1 font-semibold">Início do Bloqueio: *</label>
                  <input
                    type="datetime-local"
                    value={bloqueioInicio}
                    onChange={e => setBloqueioInicio(e.target.value)}
                    className="w-full bg-[#181B26] border border-[#2B3042] text-[#F5F3EF] p-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                {/* Data e Hora Fim */}
                <div>
                  <label className="block text-[#8E8B82] mb-1 font-semibold">Término do Bloqueio: *</label>
                  <input
                    type="datetime-local"
                    value={bloqueioFim}
                    onChange={e => setBloqueioFim(e.target.value)}
                    className="w-full bg-[#181B26] border border-[#2B3042] text-[#F5F3EF] p-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                {/* Motivo */}
                <div>
                  <label className="block text-[#8E8B82] mb-1 font-semibold">Motivo / Descrição:</label>
                  <input
                    type="text"
                    value={bloqueioMotivo}
                    onChange={e => setBloqueioMotivo(e.target.value)}
                    placeholder="Ex: Almoço / Folga / Manutenção"
                    className="w-full bg-[#181B26] border border-[#2B3042] text-[#F5F3EF] p-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {msgBloqueio && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  msgBloqueio.tipo === 'sucesso' 
                    ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300' 
                    : 'bg-red-950/40 border border-red-800 text-red-300'
                }`}>
                  {msgBloqueio.tipo === 'sucesso' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{msgBloqueio.texto}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={salvandoBloqueio}
                  className="px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C05B] disabled:opacity-50 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {salvandoBloqueio ? 'Salvando Bloqueio...' : 'Travar Horário na Agenda'}
                </button>
              </div>
            </form>

            {/* Lista de Bloqueios Ativos */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#B8B5AE]">
                  Bloqueios Ativos e Futuros ({bloqueios.length})
                </h3>
                <button
                  onClick={carregarBloqueios}
                  className="p-1.5 rounded-lg bg-[#181B26] text-[#D4AF37] border border-[#2B3042] hover:bg-[#202433]"
                  title="Atualizar"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${carregandoBloqueios ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {carregandoBloqueios ? (
                <div className="py-12 text-center text-xs text-[#8E8B82]">Carregando bloqueios...</div>
              ) : bloqueios.length === 0 ? (
                <div className="py-12 text-center bg-[#13151D] border border-[#242836] rounded-xl p-6 space-y-2">
                  <Unlock className="w-8 h-8 text-[#D4AF37]/50 mx-auto" />
                  <p className="text-sm font-semibold text-[#F5F3EF]">Nenhum horário travado no momento</p>
                  <p className="text-xs text-[#8E8B82]">Todos os horários padrão da barbearia estão livres para reserva.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {bloqueios.map(b => {
                    const dtIni = new Date(b.data_hora_inicio);
                    const dtFim = new Date(b.data_hora_fim);

                    return (
                      <div
                        key={b.id}
                        className="bg-[#13161F] border border-[#252A38] rounded-xl p-4 space-y-2.5 relative group hover:border-[#3A4056] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {b.barbeiro_nome ? `Barbeiro: ${b.barbeiro_nome}` : 'Todos os Barbeiros'}
                          </span>
                          <button
                            onClick={() => handleRemoverBloqueio(b.id)}
                            className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800 transition-colors"
                            title="Desbloquear horário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-[#F5F3EF] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>
                              {dtIni.toLocaleDateString('pt-BR')} das {dtIni.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} até {dtFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {b.motivo && (
                            <p className="text-[#8E8B82] text-[11px] italic">
                              Motivo: {b.motivo}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 3: BOT DE LEMBRETES WHATSAPP */}
        {/* ============================================================== */}
        {abaAtiva === 'lembretes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-sm uppercase tracking-wider font-bold text-[#D4AF37]">
                  Bot de Lembretes Automáticos WhatsApp
                </h2>
                <p className="text-xs text-[#8E8B82] mt-1">
                  Envia mensagens aos clientes no dia do corte com endereço, horário, barbeiro e orientações de chegada.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={dataLembreteFiltro}
                  onChange={e => setDataLembreteFiltro(e.target.value)}
                  className="bg-[#181B26] border border-[#2B3042] text-[#F5F3EF] px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  onClick={handleDispararTodosLembretes}
                  disabled={disparandoLembretes || lembretes.length === 0}
                  className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  {disparandoLembretes ? 'Disparando...' : `Disparar Todos (${lembretes.length})`}
                </button>
              </div>
            </div>

            {resumoDisparo && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
                <div>
                  <strong>Disparo Concluído!</strong> Total: {resumoDisparo.total} | Enviados: {resumoDisparo.enviados} | Falhas: {resumoDisparo.falhas}
                </div>
                <button onClick={() => setResumoDisparo(null)} className="text-emerald-400 hover:text-white font-bold">
                  ✕
                </button>
              </div>
            )}

            {/* Visão dos Agendamentos do Dia para Disparo */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider font-bold text-[#B8B5AE]">
                  Agendamentos para {dataLembreteFiltro.split('-').reverse().join('/')} ({lembretes.length})
                </span>
                <button
                  onClick={carregarLembretes}
                  className="p-1.5 rounded-lg bg-[#181B26] text-[#D4AF37] border border-[#2B3042] hover:bg-[#202433]"
                  title="Atualizar"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${carregandoLembretes ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {carregandoLembretes ? (
                <div className="py-12 text-center text-xs text-[#8E8B82]">Carregando agendamentos do dia...</div>
              ) : lembretes.length === 0 ? (
                <div className="py-12 text-center bg-[#13151D] border border-[#242836] rounded-xl p-6 space-y-2">
                  <Bot className="w-8 h-8 text-[#D4AF37]/50 mx-auto" />
                  <p className="text-sm font-semibold text-[#F5F3EF]">Nenhum cliente agendado nesta data</p>
                  <p className="text-xs text-[#8E8B82]">Escolha outra data no filtro acima ou aguarde novos agendamentos.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lembretes.map(ag => (
                    <div
                      key={ag.id}
                      className="bg-[#13161F] border border-[#252A38] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-[#383E54] transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#D4AF37]">#{ag.id}</span>
                          <span className="font-bold text-sm text-[#F5F3EF]">{ag.cliente_nome}</span>
                          <span className="text-xs text-[#8E8B82]">({ag.cliente_whatsapp})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#B8B5AE]">
                          <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
                            <Clock className="w-3 h-3" />
                            {ag.hora_inicio}
                          </span>
                          <span>•</span>
                          <span>Barbeiro: <strong>{ag.barbeiro_nome}</strong></span>
                          <span>•</span>
                          <span>Serviço: <strong>{ag.servicos_nomes}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Botão de Envio Manual 1-clique WhatsApp Web */}
                        <a
                          href={ag.link_whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          Enviar Lembrete WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
