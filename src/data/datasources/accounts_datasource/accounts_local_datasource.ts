import TableTitle from '../../databases/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import AccountsDatasource from './accounts_datasource';

const AccountsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): AccountsDatasource => {
  const table = TableTitle.accounts;

  return {
    getAllByUserId: (userId) => {
      const script = `SELECT * FROM ${table}
      WHERE user_id = ${userId}`;

      return sqlDatabase.getAll(script);
    },
    create: ({ userId, title, currencyId }) => {
      const script = `INSERT INTO ${table} (user_id, title, currency_id)
      VALUES (${userId}, '${title}', ${currencyId})`;

      return sqlDatabase.create(script);
    },
    update: ({ id, title }) => {
      const setFields = [title && `title = '${title}'`];
      const set = setFields.filter((v) => v).join(', ');
      const script = `UPDATE ${table} SET ${set} WHERE id = ${id}`;
      return sqlDatabase.update(script);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table} WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
  };
};

export default AccountsLocalDatasource;

