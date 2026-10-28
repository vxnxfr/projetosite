import sqlOdbc, { Pool } from 'msnodesqlv8';

const connectionString =
  process.env.DB_CONNECTION_STRING ||
  'Driver={ODBC Driver 18 for SQL Server};Server=localhost\\SQLEXPRESS;Database=dev_database;Trusted_Connection=yes;TrustServerCertificate=yes;';

declare global {
  // eslint-disable-next-line no-var
  var __barbeariaSqlPoolV2: Promise<Pool> | undefined;
}

function getPool(): Promise<Pool> {
  if (!globalThis.__barbeariaSqlPoolV2) {
    const pool = new sqlOdbc.Pool({
      connectionString,
      floor: 2,
      ceiling: 15,
      heartbeatSecs: 30,
      inactivityTimeoutSecs: 180,
    });
    pool.on('error', (err: any) => {
      console.error('Aviso no pool SQL Server:', err?.message || err);
    });
    globalThis.__barbeariaSqlPoolV2 = pool.promises
      .open()
      .then(() => pool)
      .catch((err: any) => {
        globalThis.__barbeariaSqlPoolV2 = undefined;
        throw err;
      });
  }
  return globalThis.__barbeariaSqlPoolV2;
}

/**
 * Executa uma consulta SQL parametrizada no banco SQL Server (dev_database)
 * reutilizando um Pool de conexões persistentes para alta concorrência.
 */
export async function querySql<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const pool = await getPool();
    const res = await pool.promises.query(query, params);
    if (res.results && res.results.length > 0) {
      for (let i = res.results.length - 1; i >= 0; i--) {
        if (Array.isArray(res.results[i]) && res.results[i].length > 0) {
          return res.results[i] as T[];
        }
      }
    }
    return (res.first || []) as T[];
  } catch (err) {
    console.error('Erro ao executar query no SQL Server:', err);
    throw err;
  }
}

/**
 * Testa a conexão ativa com o SQL Server
 */
export async function testConnection(): Promise<boolean> {
  try {
    const res = await querySql('SELECT @@SERVERNAME as srv, DB_NAME() as db');
    return res && res.length > 0;
  } catch {
    return false;
  }
}
