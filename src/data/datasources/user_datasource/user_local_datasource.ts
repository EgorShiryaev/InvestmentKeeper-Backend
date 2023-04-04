import UserDatasource from './user_datasource';
import UserModel from '../../models/user';
import DatasourceParameters from '../datasource_parameters';
import TableTitle from '../../databases/types/table_title';
import { encodePassword } from '../../../core/utils/encoded_password/encode_password';

const UserLocalDatasource = ({
  sqlDatabase,
}: DatasourceParameters): UserDatasource => {
  const tableTitle = TableTitle.users;

  return {
    getByEmail: async (email) => {
      const script = `SELECT * FROM ${tableTitle} WHERE email = "${email}"`;
      return sqlDatabase.get<UserModel>(script);
    },
    add: async (user) => {
      const encodedPassword = await encodePassword(user.password);
      const script = `INSERT INTO ${tableTitle} (name, email, password) 
      VALUES("${user.name}", "${user.email}", "${encodedPassword}")`;
      return sqlDatabase.run(script);
    },
  };
};

export default UserLocalDatasource;

