import { SqlDatabase } from '../../../data/databases/types';
import UserInvestmentAccountsLocalDatasource from '../../../data/datasources/user_investment_accounts_datasource/user_investment_accounts_local_datasource';
import UserInvestmentAccountsRepositoryImpl from '../../../domain/repositories/user_investment_accounts_repository/user_investment_accounts_repository_impl';
import CreateUserInvestmentAccountApi from '../../apis/create_user_investment_account_api';
import GetInvestmentAccountsApi from '../../apis/get_investment_accounts_api';
import UserInvestmentAccountsModule from './user_investment_accounts_module';

const userInvestmentAccountsModuleDependencyInjection = (
  sqlDatabase: SqlDatabase,
): UserInvestmentAccountsModule => {
  const userInvestmentAccountsDatasource =
    UserInvestmentAccountsLocalDatasource({
      sqlDatabase: sqlDatabase,
    });

  const userInvestmentAccountsRepository = UserInvestmentAccountsRepositoryImpl(
    {
      userInvestmentAccountsDatasource: userInvestmentAccountsDatasource,
    },
  );

  const getUserInvestmentAccountsApi = GetInvestmentAccountsApi({
    repository: userInvestmentAccountsRepository,
  });
  const createUserInvestmentAccountApi = CreateUserInvestmentAccountApi({
    repository: userInvestmentAccountsRepository,
  });

  return {
    getUserInvestmentAccounts: getUserInvestmentAccountsApi,
    createUserInvestmentAccount: createUserInvestmentAccountApi,
  };
};

export default userInvestmentAccountsModuleDependencyInjection;