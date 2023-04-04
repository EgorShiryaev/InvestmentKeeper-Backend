import { SqlDatabase } from '../../../data/databases/types';
import InvestmentAccountsLocalDatasource from '../../../data/datasources/investment_accounts_datasource/investment_accounts_local_datasource';
import InvestmentAccountsRepositoryImpl from '../../../domain/repositories/investment_accounts_repository/investment_accounts_repository_impl';
import CreateUserInvestmentAccountApi from '../../../presentation/api/investment_account/create_user_investment_account_api';
import GetInvestmentAccountsApi from '../../../presentation/api/investment_account/get_investment_accounts_api';
import UpdateUserInvestmentAccountApi from '../../../presentation/api/investment_account/update_user_investment_account_api';
import InvestmentAccountsModule from './investment_accounts_module';

const investmentAccountsModuleDependencyInjection = (
  sqlDatabase: SqlDatabase,
): InvestmentAccountsModule => {
  const investmentAccountsLocalDatasource = InvestmentAccountsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });

  const investmentAccountsRepository = InvestmentAccountsRepositoryImpl({
    localDatasource: investmentAccountsLocalDatasource,
  });

  const getUserInvestmentAccountsApi = GetInvestmentAccountsApi({
    repository: investmentAccountsRepository,
  });
  const createInvestmentAccountApi = CreateUserInvestmentAccountApi({
    repository: investmentAccountsRepository,
  });
  const updateInvestmentAccountApi = UpdateUserInvestmentAccountApi({
    repository: investmentAccountsRepository,
  });

  return {
    getUserInvestmentAccounts: getUserInvestmentAccountsApi,
    createInvestmentAccount: createInvestmentAccountApi,
    updateInvestmentAccount: updateInvestmentAccountApi,
  };
};

export default investmentAccountsModuleDependencyInjection;

