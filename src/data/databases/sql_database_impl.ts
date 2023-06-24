import path from 'path';
import { Database, verbose as initSqlite3 } from 'sqlite3';
import DatabaseException from '../../core/exception/database_exception';
import SqlDatabase from './sql_database';

const SqlDatabaseImpl = async (): Promise<SqlDatabase> => {
  const initDatabase = (): Database => {
    const databasePath = path.resolve(
      __dirname,
      '../../../database/database.db',
    );
    try {
      const sqlite3 = initSqlite3();
      return new sqlite3.Database(databasePath, (error) => {
        if (error) {
          console.log('Database failure open', error);
          return;
        }
        console.log('Database success open');
      });
    } catch (error) {
      console.log(error, databasePath);
      throw DatabaseException(error);
    }
  };

  const database = initDatabase();

  return {
    get: <T>(sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        database.get<T>(sqlScript, (error, result) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          //@ts-ignore
          resolve(result);
        });
      });
    },
    getAll: <T>(sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        database.all<T>(sqlScript, (error, result) => {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          //@ts-ignore
          resolve(result);
        });
      });
    },
    create: (sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        database.run(`${sqlScript}`, function (error) {
          if (error) {
            console.log('DB Error', error);
            reject(DatabaseException(error.message));
            return;
          }
          resolve(this.lastID);
        });
      });
    },
    update: (sqlScript: string) => {
      console.log('script', sqlScript);
      return new Promise((resolve, reject) => {
        database.run(sqlScript, function (error) {
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
        database.run(sqlScript, (error) => {
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

