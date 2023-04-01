import { Database, verbose as initSqlite3 } from "sqlite3";
import {
  GetAllResult,
  GetResult,
  RunResult,
  SqlDatabaseModel,
  VoidCallback,
} from "../types/sql_database";

type Params = {
  databasePath: string;
};

const SqlDatabase = ({ databasePath }: Params): SqlDatabaseModel => {
  const initDatabase = (): Database => {
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

  const get = <T>(sqlScript: string): Promise<GetResult<T>> => {
    return new Promise((resolve, reject) => {
      database.get(sqlScript, (error, row: GetResult<T>) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(row);
      });
    });
  };

  const getAll = <T>(sqlScript: string): Promise<GetAllResult<T>> => {
    return new Promise((resolve, reject) => {
      database.all(sqlScript, (error, rows: GetAllResult<T>) => {
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

export default SqlDatabase;
