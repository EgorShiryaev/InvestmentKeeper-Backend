import TableTitle from '../../databases/types/table_title';
import UserModel from '../../models/user_model';
import LocalDatasourceParameters from '../local_datasource_parameters';
import UsersDatasource from './users_datasource';

const UsersLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): UsersDatasource => {
  const table = TableTitle.users;

  return {
    getByPhoneNumber: (phoneNumber) => {
      const script = `SELECT * FROM ${table} 
        WHERE phoneNumber = "${phoneNumber}"`;

      return sqlDatabase.get<UserModel>(script);
    },
    create: (data) => {
      const script = `INSERT INTO ${table} (name, phoneNumber, password) 
        VALUES ("${data.name}", "${data.phoneNumber}", "${data.password}")`;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table} WHERE id = ${id}`;

      return sqlDatabase.get<UserModel>(script);
    },
  };
};

export default UsersLocalDatasource;

