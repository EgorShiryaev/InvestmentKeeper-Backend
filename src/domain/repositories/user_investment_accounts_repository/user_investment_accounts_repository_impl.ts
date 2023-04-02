import UserInvestmentAccountsDatasource from '../../../data/datasources/user_investment_accounts_datasource/user_investment_accounts_datasource';
import UserInvestmentAccountsRepository from './user_investment_accounts_repository';

type Params = {
  userInvestmentAccountsDatasource: UserInvestmentAccountsDatasource;
  // investmentInstrumentsDatasource:
};

const UserInvestmentAccountsRepositoryImpl = ({
  userInvestmentAccountsDatasource,
}: Params): UserInvestmentAccountsRepository => {
  return {
    getAll: async (userId) => {
      const records = await userInvestmentAccountsDatasource.getAll(userId);

      return records;
    },
  };
};

export default UserInvestmentAccountsRepositoryImpl;

