import { SqlDatabase } from '../../../data/databases/types';
import UserInvestmentAccountsLocalDatasource from '../../../data/datasources/user_investment_accounts_datasource/user_investment_accounts_local_datasource';
import UserInvestmentAccountsRepositoryImpl from '../../../domain/repositories/user_investment_accounts_repository/user_investment_accounts_repository_impl';
import CreateUserInvestmentAccountApi from '../../../presentation/api/investment_account/create_user_investment_account_api';
import GetInvestmentAccountsApi from '../../../presentation/api/investment_account/get_investment_accounts_api';
import UpdateUserInvestmentAccountApi from '../../../presentation/api/investment_account/update_user_investment_account_api';
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
  const createInvestmentAccountApi = CreateUserInvestmentAccountApi({
    repository: userInvestmentAccountsRepository,
  });
  const updateInvestmentAccountApi = UpdateUserInvestmentAccountApi({
    repository: userInvestmentAccountsRepository,
  });

  return {
    getUserInvestmentAccounts: getUserInvestmentAccountsApi,
    createInvestmentAccount: createInvestmentAccountApi,
    updateInvestmentAccount: updateInvestmentAccountApi
  };
};

export default userInvestmentAccountsModuleDependencyInjection;

