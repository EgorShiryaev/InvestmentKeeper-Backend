import NotFoundException from '../../../core/exceptions/not_found_exception';
import UserInvestmentAccountsDatasource from '../../../data/datasources/user_investment_accounts_datasource/user_investment_accounts_datasource';
import UserInvestmentAccountsRepository from './user_investment_accounts_repository';

type Params = {
  userInvestmentAccountsDatasource: UserInvestmentAccountsDatasource;
};

const UserInvestmentAccountsRepositoryImpl = ({
  userInvestmentAccountsDatasource,
}: Params): UserInvestmentAccountsRepository => {
  return {
    getAll: (userId) => {
      return userInvestmentAccountsDatasource.getAll(userId);
    },
    create: (params) => {
      return userInvestmentAccountsDatasource.create(params);
    },
    update: async (params) => {
      const result = await userInvestmentAccountsDatasource.update(params);
      if (!result.changes) {
        throw NotFoundException();
      }
      return result;
    },
  };
};

export default UserInvestmentAccountsRepositoryImpl;

