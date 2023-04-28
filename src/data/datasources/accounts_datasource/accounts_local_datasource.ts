import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import AccountsDatasource from './accounts_datasource';

const AccountsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): AccountsDatasource => {
  const table = TableTitle.accounts;

  return {
    getAllByUserId: (userId) => {
      const script = `SELECT * FROM ${table}
      WHERE userId = ${userId}`;

      return sqlDatabase.getAll(script);
    },
    create: ({ userId, title }) => {
      const script = `INSERT INTO ${table} (userId, title)
      VALUES (${userId}, "${title}")`;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
    update: ({ id, title, visibility, balance }) => {
      const setFields = [
        title && `title = "${title}"`,
        visibility !== undefined && `visibility = "${visibility ? 1 : 0}"`,
        balance !== undefined && `balance = ${balance}`,
      ];
      const set = setFields.filter((v) => v).join(', ');
      const script = `UPDATE ${table} SET ${set} WHERE id = ${id}`;
      return sqlDatabase.run(script).then((v) => v.changes);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table}
      WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
  };
};

export default AccountsLocalDatasource;

