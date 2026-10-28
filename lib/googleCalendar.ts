/**
 * Utilitários para Integração com Google Agenda (Google Calendar)
 */

interface CalendarEventData {
  titulo: string;
  clienteNome: string;
  clienteTelefone: string;
  barbeiroNome: string;
  servicosNomes: string[];
  valorTotal: number;
  dataHoraInicio: string; // ISO string ou YYYY-MM-DDTHH:mm:ss
  duracaoMinutos: number;
  endereco?: string;
}

function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
}

export function generateGoogleCalendarUrl(data: CalendarEventData): string {
  const startDate = new Date(data.dataHoraInicio);
  const endDate = new Date(startDate.getTime() + data.duracaoMinutos * 60000);

  const datesParam = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
  
  const title = `💈 Barbearia Val: ${data.servicosNomes.join(' + ')} - ${data.clienteNome}`;
  
  const endereco = data.endereco || 'Av. Adutora, 530 - Jardim Nova Poá, Poá - SP, 08568-300';
  
  const details = [
    `💈 AGENDAMENTO - BARBEARIA VAL`,
    `----------------------------------------`,
    `👤 Cliente: ${data.clienteNome}`,
    `📱 WhatsApp: ${data.clienteTelefone}`,
    `✂️ Barbeiro: ${data.barbeiroNome}`,
    `📋 Serviço(s): ${data.servicosNomes.join(', ')}`,
    `⏱ Duração estimada: ${data.duracaoMinutos} min`,
    `💰 Valor Total: R$ ${data.valorTotal.toFixed(2).replace('.', ',')}`,
    `📍 Endereço: ${endereco}`,
    `----------------------------------------`,
    `Horário reservado pelo sistema online da Barbearia Val.`
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details: details,
    location: endereco,
    sprop: 'website:https://www.valbarbearia.com'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateICSContent(data: CalendarEventData): string {
  const startDate = new Date(data.dataHoraInicio);
  const endDate = new Date(startDate.getTime() + data.duracaoMinutos * 60000);
  const startStr = formatGoogleDate(startDate);
  const endStr = formatGoogleDate(endDate);
  const nowStr = formatGoogleDate(new Date());

  const summary = `Barbearia Val: ${data.servicosNomes.join(' + ')} - ${data.clienteNome}`;
  const description = `Cliente: ${data.clienteNome} | WhatsApp: ${data.clienteTelefone} | Barbeiro: ${data.barbeiroNome} | Valor: R$ ${data.valorTotal.toFixed(2)}`;
  const location = data.endereco || 'Av. Adutora, 530 - Jardim Nova Poá, Poá - SP';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Barbearia Val//Agendamento Online//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:valbarbearia-${startDate.getTime()}@valbarbearia.com`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete de corte na Barbearia Val em 30 minutos',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

