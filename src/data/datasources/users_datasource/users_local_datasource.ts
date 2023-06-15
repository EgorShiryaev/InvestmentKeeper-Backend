import TableTitle from '../../databases/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import UsersDatasource from './users_datasource';

const UsersLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): UsersDatasource => {
  const table = TableTitle.users;

  return {
    getByPhoneNumber: (phoneNumber) => {
      const script = `SELECT * FROM ${table} 
        WHERE phone_number = '${phoneNumber}'`;

      return sqlDatabase.get(script);
    },
    create: (data) => {
      const script = `INSERT INTO ${table} (name, phone_number, password) 
        VALUES ('${data.name}', '${data.phoneNumber}', '${data.password}')`;

      return sqlDatabase.create(script);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table} WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
  };
};

export default UsersLocalDatasource;

