import UserInvestmentAccountsDatasource from '../../../data/datasources/user_investment_accounts_datasource/user_investment_accounts_datasource';
import UserInvestmentAccountsRepository from './user_investment_accounts_repository';

type Params = {
  userInvestmentAccountsDatasource: UserInvestmentAccountsDatasource;
};

const UserInvestmentAccountsRepositoryImpl = ({
  userInvestmentAccountsDatasource,
}: Params): UserInvestmentAccountsRepository => {
  return {
    getAll:  (userId) => {
      return userInvestmentAccountsDatasource.getAll(userId);
    },
    create: (params) => {
      return userInvestmentAccountsDatasource.create(params);
    }
  };
};

export default UserInvestmentAccountsRepositoryImpl;

