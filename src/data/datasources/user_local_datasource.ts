import UserDatasource from './user_datasource';
import UserModel from '../models/user';
import UserEntity from '../../domain/entities/user';
import { SqlDatabase } from '../databases/types';

type Params = {
    sqlDatabase: SqlDatabase;
};

const UserLocalDatasource = async ({
  sqlDatabase,
}: Params): Promise<UserDatasource> => {
  const tableTitle = 'Users';

  const createTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${tableTitle} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )`;
    await sqlDatabase.run(script);
  };

  await createTableIfNotExists();

  const getByEmail = async (email: string) => {
    const script = `SELECT * FROM ${tableTitle} WHERE email = "${email}"`;
    return sqlDatabase.get<UserModel>(script);
  };

  const add = async (user: UserEntity) => {
    const script = `INSERT INTO ${tableTitle} (name, email, password ) 
    VALUES("${user.name}", "${user.email}", "${user.password}")`;
    return sqlDatabase.run(script);
  };

  return {
    getByEmail: getByEmail,
    add: add,
  };
};

export default UserLocalDatasource;

