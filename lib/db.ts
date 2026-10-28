import sqlOdbc from 'msnodesqlv8';

const connectionString = 
  process.env.DB_CONNECTION_STRING || 
  "Driver={ODBC Driver 18 for SQL Server};Server=localhost\\SQLEXPRESS;Database=dev_database;Trusted_Connection=yes;TrustServerCertificate=yes;";

/**
 * Executa uma consulta SQL parametrizada no banco SQL Server (dev_database)
 */
export function querySql<T = any>(query: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    sqlOdbc.query(connectionString, query, params, (err, rows) => {
      if (err) {
        console.error('Erro ao executar query no SQL Server:', err);
        return reject(err);
      }
      resolve((rows || []) as T[]);
    });
  });
}

/**
 * Testa a conexão ativa com o SQL Server
 */
export async function testConnection(): Promise<boolean> {
  try {
    const res = await querySql('SELECT @@SERVERNAME as srv, DB_NAME() as db');
    return res && res.length > 0;
  } catch (e) {
    return false;
  }
}
