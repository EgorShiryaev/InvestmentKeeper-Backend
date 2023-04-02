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
      const script = `SELECT id, title, "type" FROM ${userInvestmentAccountsTitle} 
      RIGHT JOIN ${investmentAccountsTitle} ON ${userInvestmentAccountsTitle}.accountId = ${investmentAccountsTitle}.id 
      WHERE userId = ${userId}`;

      return sqlDatabase.getAll<InvestmentAccountModel>(script);
    },
  };
};

export default UserInvestmentAccountsLocalDatasource;

