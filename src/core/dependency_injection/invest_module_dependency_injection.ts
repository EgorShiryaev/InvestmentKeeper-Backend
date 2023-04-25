import AccountItemsLocalDatasource from '../../data/datasources/account_items_datasource/account_items_local_datasource';
import AccountsLocalDatasource from '../../data/datasources/accounts_datasource/accounts_local_datasource';
import InstrumentCommentsLocalDatasource from '../../data/datasources/instrument_comments_datasource/instrument_comments_local_datasource';
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
import GetComment from '../../presentation/api/invest_module/get_comment';
import SearchInvestInstrument from '../../presentation/api/invest_module/search_invest_instrument';
import UpdateAccount from '../../presentation/api/invest_module/update_account';
import InvestModule from '../../presentation/types/modules/invest_module';
import ModuleDIParams from './module_di_params';

const investModuleDependencyInjection = ({
  sqlDatabase,
}: ModuleDIParams): InvestModule => {
  const accountsDatasource = AccountsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const accountItemsDatasource = AccountItemsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
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
  const instrumentCommentsDatasource = InstrumentCommentsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });

  const getAccounts = GetAccounts({
    accountsDatasource: accountsDatasource,
    accountItemsDatasource: accountItemsDatasource,
  });
  const createAccount = CreateAccount({
    accountsDatasource: accountsDatasource,
  });
  const updateAccount = UpdateAccount({
    accountsDatasource: accountsDatasource,
  });
  const changeVisibilityAccount = ChangeVisibilityAccount({
    accountsDatasource: accountsDatasource,
  });
  const searchInstrument = SearchInvestInstrument({
    investInstrumentsDatasource: investInstrumentsDatasource,
  });
  const createSale = CreateSale({
    accountItemsDatasource: accountItemsDatasource,
    salesDatasource: salesDatasource,
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
  });
  const createPurchase = CreatePurchase({
    accountItemsDatasource: accountItemsDatasource,
    purchasesDatasource: purchasesDatasource,
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
  });
  const createRefill = CreateRefill({
    refillsDatasource: refillsDatasource,
    accountsDatasource: accountsDatasource,
  });
  const createWithdrawal = CreateWithdrawal({
    withdrawalsDatasource: withdrawalsDatasource,
    accountsDatasource: accountsDatasource,
  });
  const getComment = GetComment({
    investInstrumentsDatasource: investInstrumentsDatasource,
    instrumentCommentsDatasource: instrumentCommentsDatasource,
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
    getComment: getComment,
  };
};

export default investModuleDependencyInjection;

