-- =====================================================================
-- Barbearia Val - Carga Inicial de Dados (Seed)
-- =====================================================================

USE dev_database;
GO

-- Barbeiros Iniciais
IF NOT EXISTS (SELECT * FROM Barbeiros WHERE nome = 'Val')
    INSERT INTO Barbeiros (nome, foto_url, bio, ativo) VALUES ('Val', '/images/barbeiro-val.jpg', 'Mestre Barbeiro fundador, especialista em cortes clássicos e barboterapia.', 1);
ELSE
    UPDATE Barbeiros SET foto_url = '/images/barbeiro-val.jpg' WHERE nome = 'Val';

IF NOT EXISTS (SELECT * FROM Barbeiros WHERE nome = 'Heitor')
    INSERT INTO Barbeiros (nome, foto_url, bio, ativo) VALUES ('Heitor', '/images/barbeiro-heitor.jpg', 'Barbeiro especialista em degradês modernos, barba alinhada e químicas.', 1);
ELSE
    UPDATE Barbeiros SET foto_url = '/images/barbeiro-heitor.jpg' WHERE nome = 'Heitor';
GO

-- Serviços Oficiais
IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Corte Masculino')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Corte Masculino', 'Cortes', 40.00, 60, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Barba')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Barba', 'Barba', 40.00, 30, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Corte + Barba')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Corte + Barba', 'Combos', 65.00, 90, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Corte Infantil')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Corte Infantil', 'Cortes', 35.00, 60, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Pézinho')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Pézinho', 'Acabamento', 20.00, 20, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Corte + Luzes')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Corte + Luzes', 'Química', 130.00, 90, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Corte + Progressiva')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Corte + Progressiva', 'Química', 80.00, 90, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Corte + Relaxamento')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Corte + Relaxamento', 'Química', 65.00, 60, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Corte + Platinado')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Corte + Platinado', 'Química', 160.00, 120, 1);

IF NOT EXISTS (SELECT * FROM Servicos WHERE nome = 'Relaxamento')
    INSERT INTO Servicos (nome, categoria, preco, duracao_min, ativo) VALUES ('Relaxamento', 'Química', 35.00, 60, 1);
GO

-- Horários de Funcionamento Oficiais
-- 0=Domingo (08:00 - 12:00)
-- 2=Terça a 5=Sexta (09:00 - 20:00)
-- 6=Sábado (08:00 - 20:00)
-- 1=Segunda Fechado (sem registro ativo)

IF NOT EXISTS (SELECT * FROM HorariosFuncionamento WHERE barbeiro_id IS NULL)
BEGIN
    -- Domingo
    INSERT INTO HorariosFuncionamento (barbeiro_id, dia_semana, hora_abertura, hora_fechamento, ativo)
    VALUES (NULL, 0, '08:00:00', '12:00:00', 1);

    -- Terça
    INSERT INTO HorariosFuncionamento (barbeiro_id, dia_semana, hora_abertura, hora_fechamento, ativo)
    VALUES (NULL, 2, '09:00:00', '20:00:00', 1);

    -- Quarta
    INSERT INTO HorariosFuncionamento (barbeiro_id, dia_semana, hora_abertura, hora_fechamento, ativo)
    VALUES (NULL, 3, '09:00:00', '20:00:00', 1);

    -- Quinta
    INSERT INTO HorariosFuncionamento (barbeiro_id, dia_semana, hora_abertura, hora_fechamento, ativo)
    VALUES (NULL, 4, '09:00:00', '20:00:00', 1);

    -- Sexta
    INSERT INTO HorariosFuncionamento (barbeiro_id, dia_semana, hora_abertura, hora_fechamento, ativo)
    VALUES (NULL, 5, '09:00:00', '20:00:00', 1);

    -- Sábado
    INSERT INTO HorariosFuncionamento (barbeiro_id, dia_semana, hora_abertura, hora_fechamento, ativo)
    VALUES (NULL, 6, '08:00:00', '20:00:00', 1);
END
GO

