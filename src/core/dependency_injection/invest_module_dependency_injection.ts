import InvestmentAssetsLocalDatasource from '../../data/datasources/investment_assets_datasource/investment_assets_local_datasource';
import AccountsLocalDatasource from '../../data/datasources/accounts_datasource/accounts_local_datasource';
import CandlesRemoteDatasource from '../../data/datasources/candles_datasource/candles_remote_datasource';
import InvestInstrumentsLocalDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_local_datasource';
import FinancialOperationsLocalDatasource from '../../data/datasources/financial_operations_datasource/financial_operations_local_datasource';
import TradingOperationsLocalDatasource from '../../data/datasources/trading_operations_datasource/trading_operations_local_datasource';
import CreateAccount from '../../presentation/api/invest_module/create_account';
import CreatePurchase from '../../presentation/api/invest_module/create_purchase';
import CreateRefill from '../../presentation/api/invest_module/create_refill';
import CreateSale from '../../presentation/api/invest_module/create_sale';
import CreateWithdrawal from '../../presentation/api/invest_module/create_withdrawal';
import GetAllAccounts from '../../presentation/api/invest_module/get_all_accounts';
import SearchInvestInstrument from '../../presentation/api/invest_module/search_invest_instrument';
import UpdateAccount from '../../presentation/api/invest_module/update_account';
import InvestModule from '../../presentation/types/modules/invest_module';
import GetCandles from '../../presentation/api/invest_module/get_candles';
import { TinkoffInvestApi } from 'tinkoff-invest-api';
import InstrumentPriceRemoteDatasource from '../../data/datasources/instrument_price_datasource/instrument_price_remote_datasource';
import CurrencyDepositsLocalDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_local_datasource';
import CurrenciesLocalDatasource from '../../data/datasources/currencies_datasource/currencies_local_datasource';
import GetAllAccountsUsecaseImpl from '../../domain/usecases/get_all_accounts_usecase';
import CreateAccountUsecaseImpl from '../../domain/usecases/create_account_usecase';
import UpdateAccountUsecaseImpl from '../../domain/usecases/update_account_usecase';
import SearchInvestInstrumentUsecaseImpl from '../../domain/usecases/search_invest_instrument_usecase';
import CreateSaleUsecaseImpl from '../../domain/usecases/create_sale_usecase';
import CreatePurchaseUsecaseImpl from '../../domain/usecases/create_purchase_usecase';
import CreateRefillUsecaseImpl from '../../domain/usecases/create_refill_usecase';
import CreateWithdrawalUsecaseImpl from '../../domain/usecases/create_withdrawal_usecase';
import GetCandlesUsecaseImpl from '../../domain/usecases/get_candles_usecase';
import GetAccountUsecaseImpl from '../../domain/usecases/get_account_usecase';
import GetAccount from '../../presentation/api/invest_module/get_account';
import SqlDatabase from '../../data/databases/sql_database';

type Params = {
  sqlDatabase: SqlDatabase;
  api: TinkoffInvestApi;
};

const investModuleDependencyInjection = ({
  sqlDatabase,
  api,
}: Params): InvestModule => {
  const accountsDatasource = AccountsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const investmentAssetsDatasource = InvestmentAssetsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const investInstrumentsDatasource = InvestInstrumentsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const tradingOperationsDatasource = TradingOperationsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const financialOperationsDatasource = FinancialOperationsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const candlesDatasource = CandlesRemoteDatasource({
    api: api,
  });
  const instrumentPriceDatasource = InstrumentPriceRemoteDatasource({
    api: api,
  });
  const currencyDepositsDatasource = CurrencyDepositsLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const currenciesDatasource = CurrenciesLocalDatasource({
    sqlDatabase: sqlDatabase,
  });

  const getAccountsUsecase = GetAllAccountsUsecaseImpl({
    accountsDatasource: accountsDatasource,
    investmentAssetsDatasource: investmentAssetsDatasource,
    instrumentPriceDatasource: instrumentPriceDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createAccountUsecase = CreateAccountUsecaseImpl({
    accountsDatasource: accountsDatasource,
    currenciesDatasource: currenciesDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const updateAccountUsecase = UpdateAccountUsecaseImpl({
    accountsDatasource: accountsDatasource,
  });
  const searchInvestInstrumentUsecase = SearchInvestInstrumentUsecaseImpl({
    investInstrumentsDatasource: investInstrumentsDatasource,
  });
  const createSaleUsecase = CreateSaleUsecaseImpl({
    investmentAssetsDatasource: investmentAssetsDatasource,
    tradingOperationsDatasource: tradingOperationsDatasource,
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createPurchaseUsecase = CreatePurchaseUsecaseImpl({
    investmentAssetsDatasource: investmentAssetsDatasource,
    tradingOperationsDatasource: tradingOperationsDatasource,
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createRefillUsecase = CreateRefillUsecaseImpl({
    financialOperationsDatasource: financialOperationsDatasource,
    accountsDatasource: accountsDatasource,
    currenciesDatasource: currenciesDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createWithdrawalUsecase = CreateWithdrawalUsecaseImpl({
    financialOperationsDatasource: financialOperationsDatasource,
    accountsDatasource: accountsDatasource,
    currenciesDatasource: currenciesDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const getCandlesUsecase = GetCandlesUsecaseImpl({
    investInstrumentsDatasource: investInstrumentsDatasource,
    candlesDatasource: candlesDatasource,
  });
  const getAccountUsecase = GetAccountUsecaseImpl({
    accountsDatasource: accountsDatasource,
    investmentAssetsDatasource: investmentAssetsDatasource,
    instrumentPriceDatasource: instrumentPriceDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });

  const getAllAccounts = GetAllAccounts({
    getAllAccountsUsecase: getAccountsUsecase,
  });
  const createAccount = CreateAccount({
    createAccountUsecase: createAccountUsecase,
  });
  const updateAccount = UpdateAccount({
    updateAccountUsecase: updateAccountUsecase,
  });
  const searchInstrument = SearchInvestInstrument({
    searchInvestInstrumentUsecase: searchInvestInstrumentUsecase,
  });
  const createSale = CreateSale({
    createSaleUsecase: createSaleUsecase,
  });
  const createPurchase = CreatePurchase({
    createPurchaseUsecase: createPurchaseUsecase,
  });
  const createRefill = CreateRefill({
    createRefillUsecase: createRefillUsecase,
  });
  const createWithdrawal = CreateWithdrawal({
    createWithdrawalUsecase: createWithdrawalUsecase,
  });
  const getCandles = GetCandles({
    getCandlesUsecase: getCandlesUsecase,
  });
  const getAccount = GetAccount({
    getAccountUsecase: getAccountUsecase,
  });

  return {
    getAllAccounts: getAllAccounts,
    getAccount: getAccount,
    createAccount: createAccount,
    updateAccount: updateAccount,
    searchInvestInstrument: searchInstrument,
    createSale: createSale,
    createPurchase: createPurchase,
    createRefill: createRefill,
    createWithdrawal: createWithdrawal,
    getCandles: getCandles,
  };
};

export default investModuleDependencyInjection;

