import AccountItemsLocalDatasource from '../../data/datasources/account_items_datasource/account_items_local_datasource';
import AccountsLocalDatasource from '../../data/datasources/accounts_datasource/accounts_local_datasource';
import InvestInstrumentsLocalDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_local_datasource';
import SalesLocalDatasource from '../../data/datasources/sales_datasource/sales_local_datasource';
import ChangeVisibilityAccount from '../../presentation/api/invest_module/change_visibility_account';
import CreateAccount from '../../presentation/api/invest_module/create_account';
import CreateSale from '../../presentation/api/invest_module/create_sale';
import GetAccounts from '../../presentation/api/invest_module/get_accounts';
import SearchInvestInstrument from '../../presentation/api/invest_module/search_invest_instrument';
import UpdateAccount from '../../presentation/api/invest_module/update_account';
import InvestModule from '../../presentation/types/modules/invest_module';
import ModuleDIParams from './module_di_params';

const investModuleDependencyInjection = ({
  sqlDatabase,
  authentificatedUsersRepository,
}: ModuleDIParams): InvestModule => {
  const accountsDatasource = AccountsLocalDatasource({ sqlDatabase });
  const accountItemsDatasource = AccountItemsLocalDatasource({ sqlDatabase });
  const investInstrumentsDatasource = InvestInstrumentsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const salesDatasource = SalesLocalDatasource({
    sqlDatabase: sqlDatabase,
  });

  const getAccounts = GetAccounts({
    accountsDatasource: accountsDatasource,
    accountItemsDatasource: accountItemsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const createAccount = CreateAccount({
    datasource: accountsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const updateAccount = UpdateAccount({
    datasource: accountsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const changeVisibilityAccount = ChangeVisibilityAccount({
    datasource: accountsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const searchInstrument = SearchInvestInstrument({
    datasource: investInstrumentsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const createSale = CreateSale({
    accountItemsDatasource: accountItemsDatasource,
    salesDatasource: salesDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });

  return {
    getAccounts: getAccounts,
    createAccount: createAccount,
    updateAccount: updateAccount,
    changeVisibilityAccount: changeVisibilityAccount,
    searchInvestInstrument: searchInstrument,
    createSale: createSale,
  };
};

export default investModuleDependencyInjection;

