// =====================================================================
// Barbearia Val - Serviço de Envio de E-mails & Convites de Calendário (.ics)
// =====================================================================

interface EnviarEmailConfirmacaoParams {
  agendamentoId: number;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  barbeiroNome: string;
  servicosNomes: string[];
  valorTotal: number;
  duracaoMinutos: number;
  dataHoraInicio: string; // YYYY-MM-DDTHH:mm:ss
  dataHoraFim: string;   // YYYY-MM-DDTHH:mm:ss
  googleCalendarUrl?: string;
}

/**
 * Converte data local (YYYY-MM-DDTHH:mm:ss no fuso America/Sao_Paulo UTC-3)
 * para formato UTC do iCalendar (YYYYMMDDTHHmmssZ).
 */
function toIcsUtcString(isoStr: string): string {
  const clean = isoStr.replace('T', ' ').trim();
  const [datePart, timePart = '00:00:00'] = clean.split(' ');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh = 0, mm = 0, ss = 0] = timePart.split(':').map(Number);
  
  // Data local São Paulo (UTC-3). Para UTC, somamos 3 horas.
  const localDate = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, ss));
  
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${localDate.getUTCFullYear()}${pad(localDate.getUTCMonth() + 1)}${pad(localDate.getUTCDate())}T${pad(localDate.getUTCHours())}${pad(localDate.getUTCMinutes())}${pad(localDate.getUTCSeconds())}Z`;
}

/**
 * Formata data legível no estilo do print:
 * "quinta-feira, 30 de outubro de 2026 às 18:00 BRT"
 */
function formatarDataEmail(isoStr: string): string {
  try {
    const clean = isoStr.replace('T', ' ').trim();
    const [datePart, timePart = '00:00'] = clean.split(' ');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh = '00', mm = '00'] = timePart.split(':');
    
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const diasSemana = [
      'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
      'quinta-feira', 'sexta-feira', 'sábado'
    ];
    
    const dt = new Date(y, m - 1, d);
    const diaNome = diasSemana[dt.getDay()];
    const mesNome = meses[m - 1];
    
    return `${diaNome}, ${d} de ${mesNome} de ${y} às ${hh}:${mm} BRT`;
  } catch {
    return isoStr;
  }
}

/**
 * Gera o conteúdo do arquivo .ics compatível com Google Calendar, Outlook e Apple Calendar.
 * Usa METHOD:REQUEST para que o Gmail exiba o convite interativo no topo.
 */
export function gerarArquivoIcs(params: EnviarEmailConfirmacaoParams): string {
  const dtStartUtc = toIcsUtcString(params.dataHoraInicio);
  const dtEndUtc = toIcsUtcString(params.dataHoraFim);
  const dtStampUtc = toIcsUtcString(new Date().toISOString());
  const uid = `valbarbearia-${params.agendamentoId}-${Date.now()}@valbarbearia.com`;
  const titulo = `Barbearia Val: ${params.servicosNomes.join(' + ')}`;
  const endereco = `Av. Adutora, 530 - Jardim Nova Poá, Poá - SP, 08568-300`;
  const descricao = `Agendamento confirmado na Barbearia Val.\\nCliente: ${params.clienteNome}\\nBarbeiro: ${params.barbeiroNome}\\nServiços: ${params.servicosNomes.join(', ')}\\nValor: R$ ${params.valorTotal.toFixed(2)}`;

  return [
    'BEGIN:VCALENDAR',
    'PRODID:-//Barbearia Val//Agendamento Online//PT-BR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStampUtc}`,
    `DTSTART:${dtStartUtc}`,
    `DTEND:${dtEndUtc}`,
    `SUMMARY:${titulo}`,
    `DESCRIPTION:${descricao}`,
    `LOCATION:${endereco}`,
    'STATUS:CONFIRMED',
    'ORGANIZER;CN="Barbearia Val":mailto:valbarbearia1@gmail.com',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${params.clienteNome}":mailto:${params.clienteEmail}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="Barbearia Val (${params.barbeiroNome})":mailto:valbarbearia1@gmail.com`,
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Gera o template HTML do e-mail com layout idêntico ao modelo de confirmação.
 */
export function gerarHtmlEmail(params: EnviarEmailConfirmacaoParams): string {
  const dataFormatada = formatarDataEmail(params.dataHoraInicio);
  const servicosStr = params.servicosNomes.join(' + ');
  const valorStr = `R$ ${params.valorTotal.toFixed(2).replace('.', ',')}`;
  const duracaoStr = `${params.duracaoMinutos} min de duração`;
  const linkAgenda = params.googleCalendarUrl || 'https://calendar.google.com';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agendamento Confirmado - Barbearia Val</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #222222;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f4f6;
      padding: 30px 10px;
    }
    .card {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }
    .header-logo {
      text-align: center;
      padding: 36px 20px 20px 20px;
      background-color: #ffffff;
    }
    .hero-title {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 10px 0;
      text-align: center;
    }
    .hero-sub {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.5;
      text-align: center;
      margin: 0 0 24px 0;
      padding: 0 20px;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 0 24px;
    }
    .details-box {
      padding: 24px;
    }
    .service-title {
      font-size: 17px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 16px 0;
    }
    .field-group {
      margin-bottom: 14px;
    }
    .field-label {
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .field-value {
      font-size: 13px;
      color: #1f2937;
      font-weight: 500;
    }
    .field-value a {
      color: #2563eb;
      text-decoration: none;
    }
    .btn-container {
      text-align: center;
      margin-top: 22px;
    }
    .btn-agenda {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 700;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
    .client-box {
      background-color: #f9fafb;
      padding: 20px 24px;
      border-top: 1px solid #e5e7eb;
    }
    .client-title {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 12px 0;
    }
    .footer {
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer strong {
      color: #4b5563;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      
      <!-- Cabeçalho com Ícone Vintage -->
      <div class="header-logo">
        <div style="width: 72px; height: 72px; margin: 0 auto 16px auto; background-color: #12141C; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #D4AF37;">
          <span style="font-size: 32px; line-height: 72px; text-align: center; display: block;">💈</span>
        </div>
        <h1 class="hero-title">Agradecemos pelo agendamento</h1>
        <p class="hero-sub">
          Olá <strong>${params.clienteNome}</strong>. O serviço <strong>"${servicosStr}"</strong> foi agendado com sucesso na Barbearia Val. Caso você tenha alguma dúvida, fique à vontade para entrar em contato.
        </p>
      </div>

      <div class="divider"></div>

      <!-- Detalhes do Serviço -->
      <div class="details-box">
        <h2 class="service-title">${servicosStr}</h2>

        <div class="field-group">
          <div class="field-label">Data e Horário:</div>
          <div class="field-value">${dataFormatada}</div>
        </div>

        <div class="field-group">
          <div class="field-label">Local:</div>
          <div class="field-value">
            <a href="https://maps.google.com/?q=Av.+Adutora,+530+-+Jardim+Nova+Poá,+Poá+-+SP,+08568-300" target="_blank">
              Av. Adutora, 530 - Jardim Nova Poá, Poá - SP, Brasil
            </a>
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">Membro da equipe / Barbeiro:</div>
          <div class="field-value"><strong>${params.barbeiroNome}</strong></div>
        </div>

        <div class="field-group">
          <div class="field-label">Preço:</div>
          <div class="field-value"><strong>${valorStr}</strong> (${duracaoStr})</div>
        </div>

        <div class="btn-container">
          <a href="${linkAgenda}" target="_blank" class="btn-agenda">
            📅 Adicionar ao Google Agenda
          </a>
        </div>
      </div>

      <!-- Informações do Cliente -->
      <div class="client-box">
        <h3 class="client-title">Informações do cliente</h3>
        <div class="field-group">
          <div class="field-label">Nome:</div>
          <div class="field-value">${params.clienteNome}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Número de telefone / WhatsApp:</div>
          <div class="field-value"><a href="tel:${params.clienteTelefone}">${params.clienteTelefone}</a></div>
        </div>
        ${params.clienteEmail ? `
        <div class="field-group" style="margin-bottom: 0;">
          <div class="field-label">E-mail:</div>
          <div class="field-value">${params.clienteEmail}</div>
        </div>
        ` : ''}
      </div>

      <!-- Rodapé -->
      <div class="footer">
        Atenciosamente,<br>
        <strong>Barbearia Val</strong> • Estilo Clássico dos Anos 50 em Poá - SP<br>
        <a href="mailto:valbarbearia1@gmail.com" style="color: #6b7280; text-decoration: underline;">valbarbearia1@gmail.com</a>
      </div>

    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Envia o e-mail de confirmação com anexo .ics interativo.
 * Se as variáveis SMTP estiverem configuradas, envia via nodemailer.
 * Se não, loga em modo simulação sem travar a aplicação.
 */
export async function enviarEmailConfirmacao(params: EnviarEmailConfirmacaoParams): Promise<{
  enviado: boolean;
  mensagem: string;
}> {
  if (!params.clienteEmail || !params.clienteEmail.includes('@')) {
    return { enviado: false, mensagem: 'E-mail do cliente não informado ou inválido.' };
  }

  const icsContent = gerarArquivoIcs(params);
  const htmlContent = gerarHtmlEmail(params);
  const assunto = `Agendamento confirmado: ${params.servicosNomes.join(' + ')} - Barbearia Val`;

  // Verifica credenciais SMTP no .env
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const remetente = process.env.SMTP_FROM || 'Barbearia Val <valbarbearia1@gmail.com>';

  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import('nodemailer');
      
      const isGmail = (smtpHost && smtpHost.includes('gmail')) || smtpUser.includes('@gmail.com');
      const transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: 'gmail',
              auth: {
                user: smtpUser,
                pass: smtpPass.replace(/\s+/g, ''), // Remove espaços acidentais de senhas de app do Google
              },
            }
          : {
              host: smtpHost || 'smtp.gmail.com',
              port: smtpPort,
              secure: smtpPort === 465,
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
              tls: {
                rejectUnauthorized: false,
              },
            }
      );

      await transporter.sendMail({
        from: remetente,
        to: params.clienteEmail,
        // Também envia cópia para a barbearia para o Google Agenda do barbeiro registrar
        bcc: smtpUser,
        subject: assunto,
        html: htmlContent,
        icalEvent: {
          filename: `agendamento-${params.agendamentoId}.ics`,
          method: 'REQUEST',
          content: icsContent
        }
      });

      console.log(`[E-mail Enviado com Sucesso] Confirmação enviada para ${params.clienteEmail}`);
      return { enviado: true, mensagem: `E-mail enviado com sucesso para ${params.clienteEmail}` };
    } catch (err: any) {
      console.error('[Falha no Envio de E-mail]', err);
      return { enviado: false, mensagem: `Falha ao enviar via SMTP: ${err.message}` };
    }
  }

  // Modo Simulação/Registro em log (quando SMTP ainda não estiver preenchido no .env)
  console.log(`[E-mail Simulado] Confirmação gerada para ${params.clienteEmail} (SMTP pendente de configuração em .env.local)`);
  return {
    enviado: true,
    mensagem: `E-mail de confirmação preparado com sucesso para ${params.clienteEmail} (Configure SMTP_USER e SMTP_PASS no .env.local para envio em produção).`
  };
}

