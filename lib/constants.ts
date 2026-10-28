export const BARBEIROS_CONTATO = {
  VAL: {
    nome: 'Val',
    whatsapp: '5511981527143',
    whatsappDisplay: '(11) 98152-7143',
    funcao: 'Mestre Barbeiro'
  },
  HEITOR: {
    nome: 'Heitor',
    whatsapp: '5511977002101',
    whatsappDisplay: '(11) 97700-2101',
    funcao: 'Barbeiro & Colorista'
  }
} as const;

export function getWhatsAppBarbeiro(barbeiroNome: string): { numero: string; display: string } {
  if (barbeiroNome.toLowerCase().includes('heitor')) {
    return {
      numero: BARBEIROS_CONTATO.HEITOR.whatsapp,
      display: BARBEIROS_CONTATO.HEITOR.whatsappDisplay
    };
  }
  // Padrão ou Val
  return {
    numero: BARBEIROS_CONTATO.VAL.whatsapp,
    display: BARBEIROS_CONTATO.VAL.whatsappDisplay
  };
}

