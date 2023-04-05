import { SqlDatabase } from '../../../data/databases/types';
import InvestmentAccountItemsLocalDatasource from '../../../data/datasources/investment_account_items_datasource/investment_account_items_local_datasource';
import InvestmentAccountsLocalDatasource from '../../../data/datasources/investment_accounts_datasource/investment_accounts_local_datasource';
import InvestmentInstrumentsLocalDatasource from '../../../data/datasources/investment_instruments_datasource/investment_instruments_local_datasource';
import InvestmentAccountItemsRepositoryImpl from '../../../domain/repositories/investment_account_items_repository/investment_account_items_repository_impl';
import InvestmentAccountsRepositoryImpl from '../../../domain/repositories/investment_accounts_repository/investment_accounts_repository_impl';
import InvestmentInstrumentsRepositoryImpl from '../../../domain/repositories/investment_instruments_repository/investment_instruments_repository_impl';
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
  const investmentAccountItemsLocalDatasource =
    InvestmentAccountItemsLocalDatasource({
      sqlDatabase: sqlDatabase,
    });
  const investmentInstrumentsDatasource = InvestmentInstrumentsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });

  const investmentAccountsRepository = InvestmentAccountsRepositoryImpl({
    localDatasource: investmentAccountsLocalDatasource,
  });
  const investmentAccountItemsRepository = InvestmentAccountItemsRepositoryImpl(
    {
      localDatasource: investmentAccountItemsLocalDatasource,
    },
  );

  const investmentInstrumentsRepository = InvestmentInstrumentsRepositoryImpl({
    localDatasource: investmentInstrumentsDatasource,
  });

  const getUserInvestmentAccountsApi = GetInvestmentAccountsApi({
    investmentAccountsRepository,
    investmentAccountItemsRepository,
    investmentInstrumentsRepository,
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

