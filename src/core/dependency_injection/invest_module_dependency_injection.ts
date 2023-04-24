import AccountItemsLocalDatasource from '../../data/datasources/account_items_datasource/account_items_local_datasource';
import AccountsLocalDatasource from '../../data/datasources/accounts_datasource/accounts_local_datasource';
import InvestInstrumentsLocalDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_local_datasource';
import PurchasesLocalDatasource from '../../data/datasources/purchases_datasource/purchases_local_datasource';
import RefillsLocalDatasource from '../../data/datasources/refills_datasource/refills_local_datasource';
import SalesLocalDatasource from '../../data/datasources/sales_datasource/sales_local_datasource';
import WithdrawalsLocalDatasource from '../../data/datasources/withdrawals_datasource/withdrawals_local_datasource';
import ChangeVisibilityAccount from '../../presentation/api/invest_module/change_visibility_account';
import CreateAccount from '../../presentation/api/invest_module/create_account';
import CreatePurchase from '../../presentation/api/invest_module/create_purchase';
import CreateRefill from '../../presentation/api/invest_module/create_refill';
import CreateSale from '../../presentation/api/invest_module/create_sale';
import CreateWithdrawal from '../../presentation/api/invest_module/create_withdrawal';
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
  const purchasesDatasource = PurchasesLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const refillsDatasource = RefillsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const withdrawalsDatasource = WithdrawalsLocalDatasource({
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
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const createPurchase = CreatePurchase({
    accountItemsDatasource: accountItemsDatasource,
    purchasesDatasource: purchasesDatasource,
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const createRefill = CreateRefill({
    refillsDatasource: refillsDatasource,
    accountsDatasource: accountsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });
  const createWithdrawal = CreateWithdrawal({
    withdrawalsDatasource: withdrawalsDatasource,
    accountsDatasource: accountsDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });

  return {
    getAccounts: getAccounts,
    createAccount: createAccount,
    updateAccount: updateAccount,
    changeVisibilityAccount: changeVisibilityAccount,
    searchInvestInstrument: searchInstrument,
    createSale: createSale,
    createPurchase: createPurchase,
    createRefill: createRefill,
    createWithdrawal: createWithdrawal,
  };
};

export default investModuleDependencyInjection;

