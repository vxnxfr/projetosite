export interface Barbeiro {
  id: number;
  nome: string;
  foto_url?: string | null;
  bio?: string | null;
  ativo: boolean;
  agendamentos_hoje?: number;
}

export interface Servico {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  duracao_min: number;
  ativo: boolean;
}

export interface AgendamentoItem {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  cliente_whatsapp: string;
  barbeiro_id: number;
  barbeiro_nome: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado' | 'Faltou';
  observacao?: string | null;
  servicos?: Servico[];
  valor_total?: number;
  duracao_total?: number;
  google_calendar_url?: string;
}

export interface SlotHorario {
  horario: string; // "09:00"
  disponivel: boolean;
  barbeiro_id?: number;
  barbeiro_nome?: string;
}

