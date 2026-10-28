const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const sqlConfig = {
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  database: 'master', // Conecta inicialmente no master para criar o dev_database
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 5000,
    requestTimeout: 10000
  }
};

async function run() {
  console.log('🔄 Conectando ao SQL Server para executar setup do dev_database...');
  try {
    const pool = await sql.connect(sqlConfig);
    console.log('✅ Conectado ao SQL Server!');

    // 1. Criar dev_database se não existir
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'dev_database')
      BEGIN
        CREATE DATABASE dev_database;
        PRINT 'Banco dev_database criado com sucesso!';
      END
    `);
    console.log('✅ Banco dev_database verificado/criado.');

    // Desconecta do master e conecta no dev_database
    await pool.close();

    const devPool = await sql.connect({
      ...sqlConfig,
      database: 'dev_database'
    });

    // 2. Executar schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      const batches = schemaSql.split(/\bGO\b/gi);
      for (const batch of batches) {
        const trimmed = batch.trim();
        if (trimmed && !trimmed.toLowerCase().startsWith('use dev_database')) {
          await devPool.request().query(trimmed);
        }
      }
      console.log('✅ Tabelas criadas/verificadas com sucesso!');
    }

    // 3. Executar seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      const batches = seedSql.split(/\bGO\b/gi);
      for (const batch of batches) {
        const trimmed = batch.trim();
        if (trimmed && !trimmed.toLowerCase().startsWith('use dev_database')) {
          await devPool.request().query(trimmed);
        }
      }
      console.log('✅ Dados iniciais (Val, Heitor, Serviços) inseridos com sucesso!');
    }

    await devPool.close();
    console.log('🎉 Setup do banco concluído com êxito!');
  } catch (err) {
    console.error('❌ Não foi possível conectar ao SQL Server local:', err.message);
    console.log('💡 Dica: Verifique se o serviço SQL Server (SQLEXPRESS) e SQL Browser estão em execução no Windows.');
  }
}

run();

