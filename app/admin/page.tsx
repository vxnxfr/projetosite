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
  Filter
} from 'lucide-react';
import { AgendamentoItem, Barbeiro } from '@/lib/types';
import { getWhatsAppBarbeiro } from '@/lib/constants';

export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [filtroBarbeiro, setFiltroBarbeiro] = useState<string>('todos');
  const [carregando, setCarregando] = useState<boolean>(true);

  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'val-admin-2026',
  };

  const carregarDados = () => {
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

  useEffect(() => {
    fetch('/api/barbeiros')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBarbeiros(data);
      });
  }, []);

  useEffect(() => {
    carregarDados();
  }, [filtroBarbeiro]);

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
              <p className="text-xs text-[#8E8B82]">Agenda Diária e Gestão de Atendimentos</p>
            </div>
          </div>

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
              onClick={carregarDados}
              className="p-2 rounded-lg bg-[#181B26] text-[#D4AF37] border border-[#2B3042] hover:bg-[#202433] transition-colors"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main List */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-sm uppercase tracking-wider font-bold text-[#D4AF37]">
            Agendamentos Registrados ({agendamentos.length})
          </h2>
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
                    {item.observacao && (
                      <div className="sm:col-span-2 md:col-span-1">
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
      </main>
    </div>
  );
}

