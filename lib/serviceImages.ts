/**
 * Mapeamento de imagens em miniatura para os serviços da Barbearia Val
 */
export function getServiceImage(nomeOuCategoria: string): string {
  const norm = (nomeOuCategoria || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (norm.includes('pezinho') || norm.includes('acabamento')) {
    return '/images/servico-pezinho.jpg';
  }
  if (norm.includes('corte + barba') || norm.includes('corte e barba') || norm.includes('combo')) {
    return '/images/servico-corte-barba.jpg';
  }
  if (norm.includes('barba')) {
    return '/images/servico-barba.jpg';
  }
  if (norm.includes('infantil') || norm.includes('crianca') || norm.includes('kids')) {
    return '/images/servico-infantil.jpg';
  }
  if (norm.includes('luzes') || norm.includes('mechas') || norm.includes('reflexo')) {
    return '/images/servico-luzes.jpg';
  }
  if (norm.includes('platinado') || norm.includes('nevou') || norm.includes('branco')) {
    return '/images/servico-platinado.jpg';
  }
  if (norm.includes('progressiva') || norm.includes('alisamento')) {
    return '/images/servico-progressiva.jpg';
  }
  if (norm.includes('relaxamento') || norm.includes('ondas') || norm.includes('cachos')) {
    return '/images/servico-relaxamento.jpg';
  }

  // Padrão: Corte Masculino clássico / fade
  return '/images/servico-corte.jpg';
}

