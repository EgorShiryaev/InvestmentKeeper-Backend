import { Pool, PoolClient } from 'pg';
import DatabaseException from '../../core/exception/database_exception';
import SqlDatabase from './sql_database';

export type SqlDatabaseImplParams = {
  user: string;
  host: string;
  password: string;
  databaseName: string;
  port: number;
};

const SqlDatabaseImpl = async (
  params: SqlDatabaseImplParams,
): Promise<SqlDatabase> => {
  const { user, host, password, databaseName, port } = params;

  const initClient = (): Promise<PoolClient> => {
    try {
      return new Pool({
        user: user,
        host: host,
        password: password,
        database: databaseName,
        port: port,
      }).connect();
    } catch (error) {
      throw DatabaseException(error);
    }
  };

  const client = await initClient();

  return {
    get: (sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        client.query(sqlScript, (error, results) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          const result =
            results.rows.length === 0 ? undefined : results.rows[0];
          resolve(result);
        });
      });
    },
    getAll: (sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        client.query(sqlScript, (error, result) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          resolve(result.rows);
        });
      });
    },
    create: (sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        client.query(`${sqlScript} RETURNING *`, (error, results) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          resolve(results.rows[0].id);
        });
      });
    },
    update: (sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        client.query(sqlScript, (error) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          resolve();
        });
      });
    },
    createTable: (sqlScript: string) => {
      return new Promise((resolve, reject) => {
        client.query(sqlScript, (error) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          resolve();
        });
      });
    },
  };
};

export default SqlDatabaseImpl;

