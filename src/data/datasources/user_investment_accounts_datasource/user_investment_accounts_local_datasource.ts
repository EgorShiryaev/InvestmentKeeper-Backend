import TableTitle from '../../databases/types/table_title';
import InvestmentAccountModel from '../../models/investment_account/investment_account';
import DatasourceParameters from '../datasource_parameters';
import UserInvestmentAccountsDatasource from './user_investment_accounts_datasource';

const UserInvestmentAccountsLocalDatasource = ({
  sqlDatabase,
}: DatasourceParameters): UserInvestmentAccountsDatasource => {
  const investmentAccountsTitle = TableTitle.investmentAccounts;
  const userInvestmentAccountsTitle = TableTitle.userInvestmentAccounts;

  return {
    getAll: (userId) => {
      const script = `SELECT id, title, "type", visibility 
      FROM ${userInvestmentAccountsTitle} 
      RIGHT JOIN ${investmentAccountsTitle} ON ${userInvestmentAccountsTitle}.accountId = ${investmentAccountsTitle}.id 
      WHERE userId = ${userId}`;

      return sqlDatabase.getAll<InvestmentAccountModel>(script);
    },
    create: async ({ userId, title, type }) => {
      const insertScript = `INSERT INTO ${investmentAccountsTitle} (title, type, visibility)
      VALUES ("${title}", "${type}", 1)`;

      const resultInsert = await sqlDatabase.run(insertScript);

      const insertAccountId = `INSERT INTO ${userInvestmentAccountsTitle} VALUES(${userId}, ${resultInsert.lastId})`;

      return sqlDatabase.run(insertAccountId);
    },
    update: ({ id, title, visibility }) => {
      const set = [
        title && `title = "${title}"`,
        visibility !== undefined && `visibility = "${visibility ? 1 : 0}"`,
      ]
        .filter((v) => v)
        .join(', ');
      const script = `UPDATE ${investmentAccountsTitle} SET ${set} WHERE id = ${id}`;

      return sqlDatabase.run(script);
    },
  };
};

export default UserInvestmentAccountsLocalDatasource;

