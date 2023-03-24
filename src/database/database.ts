import { Database as DatabaseSqlite3, verbose as initSqlite3 } from "sqlite3";

export type RunResult = {
  lastId: number;
  changes: number;
};

export type GetResult = Object | undefined;

export type GetAllResult = Object[];

type VoidCallback = () => void;

export interface Database {
  run: (sqlScript: string) => Promise<RunResult>;
  get: (sqlScript: string) => Promise<GetResult>;
  getAll: (sqlScript: string) => Promise<GetAllResult>;
  close: () => Promise<void>;
  serialize: (fun: VoidCallback) => void;
}

const DatabaseImpl = (databasePath: string): Database => {
  const initDatabase = (): DatabaseSqlite3 => {
    const sqlite3 = initSqlite3();
    return new sqlite3.Database(databasePath, (error) => {
      if (error) {
        //TODO: после реализации logger заменить
        console.log("Database failure open", error);
        return;
      }
      //TODO: после реализации logger заменить
      console.log("Database success open");
    });
  };

  const database = initDatabase();

  const close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      database.close((error) => {
        if (error) {
          reject(error);
          console.log("Database failure close", error);
          return;
        }
        resolve();
        console.log("Database success close");
      });
    });
  };

  const run = (sqlScript: string): Promise<RunResult> => {
    return new Promise((resolve) => {
      database.run(sqlScript, function () {
        resolve({
          lastId: this.lastID,
          changes: this.changes,
        });
      });
    });
  };

  const get = (sqlScript: string): Promise<GetResult> => {
    return new Promise((resolve, reject) => {
      database.get(sqlScript, (error, row: GetResult) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(row);
      });
    });
  };

  const getAll = (sqlScript: string): Promise<GetAllResult> => {
    return new Promise((resolve, reject) => {
      database.all(sqlScript, (error, rows: GetAllResult) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(rows);
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

export default DatabaseImpl;
