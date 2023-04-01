import { NOTFOUND } from "sqlite3";
import DatabaseException from "../exceptions/database_exception";
import Exception from "../exceptions/exception";
import NotFoundException from "../exceptions/not_found_exception";
import { SqlDatabaseModel } from "../types/sql_database";
import UserDatasource from "../types/datasources/user_datasource";

type Params = {
  sqlDatabase: SqlDatabaseModel;
};

const UserLocalDatasource = ({ sqlDatabase }: Params): UserDatasource => {
  const tableTitle = "Users";

  const createTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${tableTitle} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
        password TEXT NOT NULL,
    )`;
    await sqlDatabase.run(script);
  };

  const getByEmail = async (email: string) => {
    const script = `SELECT * FROM ${tableTitle} WHERE email = ${email}`;
    return sqlDatabase.get<User>(script);
  };

  createTableIfNotExists();

  return {
    getByEmail: getByEmail,
  };
};

export default UserLocalDatasource;
