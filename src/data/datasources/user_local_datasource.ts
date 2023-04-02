import UserDatasource from './user_datasource';
import UserModel from '../models/user';
import UserEntity from '../../domain/entities/user';
import { SqlDatabase } from '../databases/types';
import { encodePassword } from '../../core/utils/crypt_password';

type Params = {
  sqlDatabase: SqlDatabase;
};

const UserLocalDatasource = ({ sqlDatabase }: Params): UserDatasource => {
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

  createTableIfNotExists();

  const getByEmail = async (email: string) => {
    const script = `SELECT * FROM ${tableTitle} WHERE email = "${email}"`;
    return sqlDatabase.get<UserModel>(script);
  };

  const add = async (user: UserEntity) => {
    const encodedPassword = await encodePassword(user.password);
    const script = `INSERT INTO ${tableTitle} (name, email, password ) 
    VALUES("${user.name}", "${user.email}", "${encodedPassword}")`;
    return sqlDatabase.run(script);
  };

  return {
    getByEmail: getByEmail,
    add: add,
  };
};

export default UserLocalDatasource;

