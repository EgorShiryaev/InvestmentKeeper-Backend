import { Pool, PoolClient } from 'pg';
import DatabaseException from '../../core/exception/database_exception';
import SqlDatabase from './sql_database';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const SqlDatabaseImpl = async (): Promise<SqlDatabase> => {
  const initPool = (): Promise<PoolClient> => {
    try {
      return pool.connect();
    } catch (error) {
      throw DatabaseException(error);
    }
  };

  const client = await initPool();

  return {
    get: (sqlScript: string) => {
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
      return new Promise((resolve, reject) => {
        client.query(`${sqlScript} RETURNING *`, (error, results) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          console.log(results.rows);
          resolve(results.rows[0].id);
        });
      });
    },
    update: (sqlScript: string) => {
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

