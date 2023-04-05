import TableTitle from '../../databases/types/table_title';
import InvestmentAccountModel from '../../models/investment_account';
import DatasourceParameters from '../datasource_parameters';
import InvestmentAccountsDatasource from './investment_accounts_datasource';

const InvestmentAccountsLocalDatasource = ({
  sqlDatabase,
}: DatasourceParameters): InvestmentAccountsDatasource => {
  const tableTitle = TableTitle.investmentAccounts;

  return {
    getAll: (userId) => {
      const script = `SELECT id, title, type, visibility FROM ${tableTitle} 
      WHERE userId = ${userId}`;

      return sqlDatabase.getAll<InvestmentAccountModel>(script);
    },
    create: async ({ userId, title, type }) => {
      const script = `INSERT INTO ${tableTitle} (userId, title, type, visibility)
      VALUES (${userId}, "${title}", "${type}", 1)`;

      return sqlDatabase.run(script);
    },
    update: ({ id, title, visibility }) => {
      const set = [
        title && `title = "${title}"`,
        visibility !== undefined && `visibility = "${visibility ? 1 : 0}"`,
      ]
        .filter((v) => v)
        .join(', ');
      const script = `UPDATE ${tableTitle} SET ${set} WHERE id = ${id}`;

      return sqlDatabase.run(script);
    },
  };
};

export default InvestmentAccountsLocalDatasource;

