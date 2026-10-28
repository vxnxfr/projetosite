-- =====================================================================
-- Barbearia Val - Script de Criação do Banco e Tabelas
-- Banco de Dados: dev_database
-- =====================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'dev_database')
BEGIN
    CREATE DATABASE dev_database;
END
GO

USE dev_database;
GO

-- 1. Clientes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Clientes')
BEGIN
    CREATE TABLE Clientes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        whatsapp VARCHAR(20) NOT NULL,
        email NVARCHAR(150) NULL,
        criado_em DATETIME2 DEFAULT SYSDATETIME()
    );
END
GO

-- 2. Barbeiros
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Barbeiros')
BEGIN
    CREATE TABLE Barbeiros (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        foto_url NVARCHAR(255) NULL,
        bio NVARCHAR(255) NULL,
        ativo BIT DEFAULT 1,
        criado_em DATETIME2 DEFAULT SYSDATETIME()
    );
END
GO

-- 3. Serviços
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Servicos')
BEGIN
    CREATE TABLE Servicos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        categoria NVARCHAR(50) DEFAULT 'Cortes',
        preco DECIMAL(10,2) NOT NULL,
        duracao_min INT NOT NULL,
        ativo BIT DEFAULT 1,
        criado_em DATETIME2 DEFAULT SYSDATETIME()
    );
END
GO

-- 4. Horários de Funcionamento (Por Barbeiro ou Geral)
-- dia_semana: 0=Domingo, 1=Segunda, 2=Terça, ..., 6=Sábado
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HorariosFuncionamento')
BEGIN
    CREATE TABLE HorariosFuncionamento (
        id INT IDENTITY(1,1) PRIMARY KEY,
        barbeiro_id INT NULL FOREIGN KEY REFERENCES Barbeiros(id),
        dia_semana TINYINT NOT NULL,
        hora_abertura TIME NOT NULL,
        hora_fechamento TIME NOT NULL,
        ativo BIT DEFAULT 1
    );
END
GO

-- 5. Bloqueios e Folgas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Bloqueios')
BEGIN
    CREATE TABLE Bloqueios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        barbeiro_id INT NULL FOREIGN KEY REFERENCES Barbeiros(id),
        data_hora_inicio DATETIME2 NOT NULL,
        data_hora_fim DATETIME2 NOT NULL,
        motivo NVARCHAR(200) NULL,
        criado_em DATETIME2 DEFAULT SYSDATETIME()
    );
END
GO

-- 6. Agendamentos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Agendamentos')
BEGIN
    CREATE TABLE Agendamentos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cliente_id INT NOT NULL FOREIGN KEY REFERENCES Clientes(id),
        barbeiro_id INT NOT NULL FOREIGN KEY REFERENCES Barbeiros(id),
        data_hora_inicio DATETIME2 NOT NULL,
        data_hora_fim DATETIME2 NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
        observacao NVARCHAR(500) NULL,
        criado_em DATETIME2 DEFAULT SYSDATETIME(),
        CONSTRAINT CK_Agendamentos_Status CHECK (status IN ('Pendente', 'Confirmado', 'Concluído', 'Cancelado', 'Faltou'))
    );
END
GO

-- 7. AgendamentoServicos (Relação N:N para múltiplos serviços)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AgendamentoServicos')
BEGIN
    CREATE TABLE AgendamentoServicos (
        agendamento_id INT NOT NULL FOREIGN KEY REFERENCES Agendamentos(id) ON DELETE CASCADE,
        servico_id INT NOT NULL FOREIGN KEY REFERENCES Servicos(id),
        preco_historico DECIMAL(10,2) NOT NULL,
        duracao_historico INT NOT NULL,
        PRIMARY KEY (agendamento_id, servico_id)
    );
END
GO

-- 8. Índices de Alta Performance para Grande Demanda
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Agendamentos_Barbeiro_Horario' AND object_id = OBJECT_ID('Agendamentos'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Agendamentos_Barbeiro_Horario 
    ON Agendamentos(barbeiro_id, data_hora_inicio, data_hora_fim)
    INCLUDE (status);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Clientes_Whatsapp' AND object_id = OBJECT_ID('Clientes'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Clientes_Whatsapp 
    ON Clientes(whatsapp)
    INCLUDE (nome);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Servicos_Ativo' AND object_id = OBJECT_ID('Servicos'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Servicos_Ativo 
    ON Servicos(ativo)
    INCLUDE (nome, preco, duracao_min, categoria);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bloqueios_Barbeiro_Data' AND object_id = OBJECT_ID('Bloqueios'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Bloqueios_Barbeiro_Data 
    ON Bloqueios(barbeiro_id, data_hora_inicio, data_hora_fim);
END
GO

