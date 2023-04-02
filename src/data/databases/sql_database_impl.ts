import { Database, verbose as initSqlite3 } from 'sqlite3';
import DatabaseException from '../../core/exceptions/database_exception';
import {
  GetAllResult,
  GetResult,
  RunResult,
  SqlDatabase,
  VoidCallback,
} from './types';

type Params = {
    databasePath: string;
};

const SqlDatabaseImpl = ({ databasePath }: Params): SqlDatabase => {
  const initDatabase = (): Database => {
    const sqlite3 = initSqlite3();
    return new sqlite3.Database(databasePath, (error) => {
      if (error) {
        //TODO: после реализации logger заменить
        console.log('Database failure open', error);
        return;
      }
      //TODO: после реализации logger заменить
      console.log('Database success open');
    });
  };

  const database = initDatabase();

  const close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      database.close((error) => {
        if (error) {
          reject(error);
          console.log('Database failure close', error);
          return;
        }
        resolve();
        console.log('Database success close');
      });
    });
  };

  const run = (sqlScript: string): Promise<RunResult> => {
    console.log(sqlScript);
    return new Promise((resolve, reject) => {
      serialize(() => {
        database.run(sqlScript, function (error) {
          if (error) {
            reject(DatabaseException({ message: error.message }));
            return;
          }
          resolve({
            lastId: this.lastID,
            changes: this.changes,
          });
        });
      });
    });
  };

  const get = <T>(sqlScript: string): Promise<GetResult<T>> => {
    console.log(sqlScript);
    return new Promise((resolve, reject) => {
      serialize(() => {
        database.get(sqlScript, (error, row: GetResult<T>) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(row);
        });
      });
    });
  };

  const getAll = <T>(sqlScript: string): Promise<GetAllResult<T>> => {
    console.log(sqlScript);
    return new Promise((resolve, reject) => {
      serialize(() => {
        database.all(sqlScript, (error, rows: GetAllResult<T>) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(rows);
        });
      });
    });
  };

  const serialize = (fun: VoidCallback) => {
    database.serialize(fun);
  };

  return {
    run,
    get,
    getAll,
    close,
    serialize,
  };
};

export default SqlDatabaseImpl;
