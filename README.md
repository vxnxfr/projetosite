# Barbearia Val - Site & Sistema de Agendamento Online

Reconstrução moderna e premium do site da **Barbearia Val** (Poá/SP) com estilo clássico dos anos 50, fluxo de agendamento mobile-first e integração com banco de dados **SQL Server** e **Google Calendar**.

---

## 💈 Funcionalidades Principais

1. **Design Vintage & Clássico Anos 50:**
   - Paleta de cores em grafite escuro (`#0B0C0E`), dourado envelhecido (`#D4AF37`) e creme com contraste aprovado pelo **WCAG AA**.
   - Preservação da identidade visual da marca (logo da tesoura com pente e bigode clássico).
   - Seção dedicada para os barbeiros **Val** e **Heitor** com especialidades e botões diretos de agendamento.
   - Informações completas sobre o ambiente (sinuca, cerveja gelada, sala de espera) e mapa interativo de localização (Av. Adutora, 530 - Poá/SP).
   - Botão flutuante de WhatsApp com seleção direta de profissional (Val / Heitor).

2. **Fluxo de Agendamento em 5 Etapas (Mobile-First):**
   - **Passo 1:** Seleção de serviço(s) com suporte a múltiplos itens no mesmo horário (ex: Corte + Pézinho).
   - **Passo 2:** Escolha do Barbeiro (**Val**, **Heitor** ou **"Sem preferência"** para distribuição inteligente).
   - **Passo 3:** Escolha de data e horário disponível em tempo real, calculando a duração total e respeitando 10 min de intervalo de limpeza/tolerância.
   - **Passo 4:** Identificação rápida (Nome e WhatsApp com máscara automática, sem necessidade de cadastro burocrático).
   - **Passo 5:** Confirmação com resumo fixo do pedido, código de agendamento e botões de ação imediata.

3. **Integração com o Google Agenda (Google Calendar):**
   - Geração automática de link oficial do Google Calendar contendo:
     - Título com serviços e nome do cliente
     - Data e horário calculados em fuso horário brasileiro
     - Detalhes com cliente, telefone, barbeiro, lista de serviços e valor total
     - Localização da barbearia (Av. Adutora, 530 - Poá/SP)
   - Permite que o cliente e o barbeiro adicionem o evento à sua agenda com apenas 1 clique no celular ou computador.
   - Mensagem pré-formatada pronta para envio no WhatsApp do barbeiro responsável com todas as informações do atendimento.

4. **Painel Administrativo da Barbearia (`/admin`):**
   - Visualização da agenda de atendimentos em tempo real.
   - Filtro por barbeiro (Val, Heitor ou Todos).
   - Atualização de status: `Pendente`, `Confirmado`, `Concluído`, `Cancelado`, `Faltou`.
   - Botão rápido para adicionar qualquer agendamento à Agenda do Google e botão direto de WhatsApp com o cliente.

---

## 🗄️ Banco de Dados (SQL Server)

Os scripts SQL estão organizados na pasta `/database`:
- `database/schema.sql`: Criação do banco `dev_database` e das tabelas `Clientes`, `Barbeiros`, `Servicos`, `HorariosFuncionamento`, `Bloqueios`, `Agendamentos`, `AgendamentoServicos` e índices anti-conflito.
- `database/seed.sql`: Carga inicial dos barbeiros (Val e Heitor), tabela oficial de serviços e grade de horários de funcionamento.
- `database/setup.js`: Script de migração automática via Node.js (`npm run db:setup`).

### Como iniciar o serviço do SQL Server local:
Caso o serviço do SQL Server Express esteja pausado ou parado:
1. Clique com o botão direito no arquivo `iniciar_sql.bat` na raiz do projeto e selecione **"Executar como administrador"**.
2. Ou abra o `services.msc` e inicie o serviço **SQL Server (SQLEXPRESS)** e **SQL Server Browser**.
3. Execute `npm run db:setup` para rodar a carga no banco.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ (instalado v24 LTS)
- SQL Server local (instância SQLEXPRESS) ou uso do repositório integrado de persistência.

### Variáveis de Ambiente (`.env.local`)
Copie o arquivo `.env.example` para `.env.local`:
```env
DB_SERVER=.\SQLEXPRESS
DB_DATABASE=dev_database
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

NEXT_PUBLIC_BARBEARIA_NOME="Barbearia Val"
NEXT_PUBLIC_WHATSAPP_HEITOR="11977002101"
NEXT_PUBLIC_WHATSAPP_VAL="11981527143"
NEXT_PUBLIC_ENDERECO="Av. Adutora, 530 - Jardim Nova Poá, Poá - SP, 08568-300"
```

### Rodando a Aplicação
```bash
# Modo Desenvolvimento
npm run dev

# Modo Produção
npm run build
npm start
```

O site estará disponível em **http://localhost:3000**
- Página Inicial: `http://localhost:3000`
- Fluxo de Agendamento: `http://localhost:3000/agendamento`
- Painel dos Barbeiros: `http://localhost:3000/admin`
