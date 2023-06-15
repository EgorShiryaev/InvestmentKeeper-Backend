import { Pool, PoolClient } from 'pg';
import DatabaseException from '../../core/exception/database_exception';
import SqlDatabase from './sql_database';

const pool = new Pool({
  user: 'api',
  host: 'localhost',
  password: 'api',
  database: 'api',
  port: 5432,
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
      console.log(sqlScript);
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
      console.log(sqlScript);
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
      console.log(sqlScript);
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
      console.log(sqlScript);
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

