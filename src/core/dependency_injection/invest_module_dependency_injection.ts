import { SqlDatabase } from '../../data/databases/types';
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
import GetAccounts from '../../presentation/api/invest_module/get_accounts';
import SearchInvestInstrument from '../../presentation/api/invest_module/search_invest_instrument';
import UpdateAccount from '../../presentation/api/invest_module/update_account';
import InvestModule from '../../presentation/types/modules/invest_module';
import GetCandles from '../../presentation/api/invest_module/get_candles';
import GetQuotes from '../../presentation/api/invest_module/get_quotes';
import InstrumentSubscribesRepositoryImpl from '../../domain/repositories/instrument_subscribes_repository/instrument_subscribes_repository_impl';
import QuotesRemoteDatasource from '../../data/datasources/quotes_datasource/quotes_remote_datasource';
import { TinkoffInvestApi } from 'tinkoff-invest-api';
import InstrumentPriceRemoteDatasource from '../../data/datasources/instrument_price_datasource/instrument_price_remote_datasource';
import CurrencyDepositsLocalDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_local_datasource';
import CurrenciesLocalDatasource from '../../data/datasources/currencies_datasource/currencies_local_datasource';

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
  const quotesDatasource = QuotesRemoteDatasource({
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

  const instrumentSubscribesRepository =
    InstrumentSubscribesRepositoryImpl(quotesDatasource);

  const getAccounts = GetAccounts({
    accountsDatasource: accountsDatasource,
    investmentAssetsDatasource: investmentAssetsDatasource,
    instrumentPriceDatasource: instrumentPriceDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createAccount = CreateAccount({
    accountsDatasource: accountsDatasource,
    currenciesDatasource: currenciesDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const updateAccount = UpdateAccount({
    accountsDatasource: accountsDatasource,
  });
  const searchInstrument = SearchInvestInstrument({
    investInstrumentsDatasource: investInstrumentsDatasource,
  });
  const createSale = CreateSale({
    investmentAssetsDatasource: investmentAssetsDatasource,
    tradingOperationsDatasource: tradingOperationsDatasource,
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createPurchase = CreatePurchase({
    investmentAssetsDatasource: investmentAssetsDatasource,
    tradingOperationsDatasource: tradingOperationsDatasource,
    accountsDatasource: accountsDatasource,
    investInstrumentsDatasource: investInstrumentsDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createRefill = CreateRefill({
    financialOperationsDatasource: financialOperationsDatasource,
    accountsDatasource: accountsDatasource,
    currenciesDatasource: currenciesDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const createWithdrawal = CreateWithdrawal({
    financialOperationsDatasource: financialOperationsDatasource,
    accountsDatasource: accountsDatasource,
    currenciesDatasource: currenciesDatasource,
    currencyDepositsDatasource: currencyDepositsDatasource,
  });
  const getCandles = GetCandles({
    investInstrumentsDatasource: investInstrumentsDatasource,
    candlesDatasource: candlesDatasource,
  });
  const getQuotes = GetQuotes({
    investInstrumentsDatasource: investInstrumentsDatasource,
    instrumentSubscribesRepository: instrumentSubscribesRepository,
  });

  return {
    getAccounts: getAccounts,
    createAccount: createAccount,
    updateAccount: updateAccount,
    searchInvestInstrument: searchInstrument,
    createSale: createSale,
    createPurchase: createPurchase,
    createRefill: createRefill,
    createWithdrawal: createWithdrawal,
    getCandles: getCandles,
    getQuotes: getQuotes,
  };
};

export default investModuleDependencyInjection;

