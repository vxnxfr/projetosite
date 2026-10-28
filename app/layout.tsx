import type { Metadata, Viewport } from 'next';
import './globals.css';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Barbearia Val | Barbearia Clássica em Poá - SP',
  description: 'Barbearia clássica estilo anos 50 em Poá/SP. Cortes masculinos, barba alinhada, ambiente climatizado com sinuca e bebidas. Agende online com Val ou Heitor.',
  keywords: ['barbearia em poá', 'barbearia val', 'corte masculino poá', 'barba poá', 'agendamento barbearia poá', 'val barbearia'],
  authors: [{ name: 'Barbearia Val' }],
  openGraph: {
    title: 'Barbearia Val | Estilo Clássico dos Anos 50 em Poá - SP',
    description: 'Ambiente vintage com sala de espera, bebidas, mesa de sinuca e os melhores profissionais de Poá.',
    url: 'https://www.valbarbearia.com',
    siteName: 'Barbearia Val',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0B0C0E] text-[#F5F3EF] flex flex-col selection:bg-[#D4AF37] selection:text-black">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

