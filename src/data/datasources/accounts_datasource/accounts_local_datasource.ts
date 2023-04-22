import TableTitle from '../../databases/types/table_title';
import AccountModel from '../../models/account_model';
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

      return sqlDatabase
        .getAll<AccountModel>(script)
        .then((v) => v as AccountModel[]);
    },
    create: ({ userId, title }) => {
      const script = `INSERT INTO ${table} (userId, title, visibility)
      VALUES (${userId}, "${title}", true)`;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
    update: ({ id, title, visibility }) => {
      const set = [
        title && `title = "${title}"`,
        visibility !== undefined && `visibility = "${visibility ? 1 : 0}"`,
      ]
        .filter((v) => v)
        .join(', ');
      const script = `UPDATE ${table} SET ${set} WHERE id = ${id}`;
      return sqlDatabase.run(script).then((v) => v.changes);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table}
      WHERE id = ${id}`;

      return sqlDatabase
        .get<AccountModel>(script)
        .then((v) => v as AccountModel);
    },
  };
};

export default AccountsLocalDatasource;

