import BadRequestException from '../../core/exception/bad_request_exception';
import ExceptionId from '../../core/exception/exception_id';
import NotFoundException from '../../core/exception/not_found_exception';
import ServerErrorException from '../../core/exception/server_error_exception';
import calculateAveragePrice from '../../core/utils/calculate_utils/calculate_average_price';
import calculateBalance from '../../core/utils/calculate_utils/calculate_balance';
import checkTotalPriceIsGreaterAccountBalance from '../../core/utils/check_total_price_is_greater_account_balance';
import makeNegativeMoney from '../../core/utils/money_utils/make_negative_money';
import checkIdIsCorrect from '../../core/utils/required_params/check_id_is_correct';
import AccountsDatasource from '../../data/datasources/accounts_datasource/accounts_datasource';
import CurrencyDepositsDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import InvestInstrumentsDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import InvestmentAssetsDatasource from '../../data/datasources/investment_assets_datasource/investment_assets_datasource';
import TradingOperationsDatasource from '../../data/datasources/trading_operations_datasource/trading_operations_datasource';
import AccountModel from '../../data/models/account_model';
import CurrencyDepositModel from '../../data/models/currency_deposit_model';
import InvestInstrumentModel from '../../data/models/invest_instrument_model';
import CreatePurchaseRequestData from '../../presentation/types/request_data/create_purchase_request_data';
import MoneyEntity from '../entities/money_entity';

type Params = {
  investmentAssetsDatasource: InvestmentAssetsDatasource;
  tradingOperationsDatasource: TradingOperationsDatasource;
  accountsDatasource: AccountsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
};

type WithdrawFundsFromBalanceParams = {
  currencyDeposit: CurrencyDepositModel;
  params: CreatePurchaseRequestData;
  instrumentLot: number;
};

type GetCurrencyDeposit = {
  account: AccountModel;
  instrument: InvestInstrumentModel;
};

type CallMethodParams = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: MoneyEntity;
  date?: string;
  commission?: MoneyEntity;
  withdrawFundsFromBalance: boolean;
};

export type CreatePurchaseUsecase = {
  call: (params: CallMethodParams) => Promise<void>;
};

const CreatePurchaseUsecaseImpl = ({
  investmentAssetsDatasource,
  tradingOperationsDatasource,
  accountsDatasource,
  investInstrumentsDatasource,
  currencyDepositsDatasource,
}: Params): CreatePurchaseUsecase => {
  const getInvestmentAsset = async (params: CreatePurchaseRequestData) => {
    const investmentAsset =
      await investmentAssetsDatasource.getByAccountIdAndInstrumentId(
        params.accountId,
        params.instrumentId,
      );
    if (investmentAsset) {
      return investmentAsset;
    }
    const id = await investmentAssetsDatasource.create({
      accountId: params.accountId,
      instrumentId: params.instrumentId,
    });

    return investmentAssetsDatasource.getById(id);
  };

  const withdrawFundsFromBalanceFn = async ({
    currencyDeposit,
    params,
    instrumentLot,
  }: WithdrawFundsFromBalanceParams) => {
    const negativePrice = makeNegativeMoney(params.price);
    const newBalance = calculateBalance({
      balance: currencyDeposit,
      price: negativePrice,
      lots: params.lots * instrumentLot,
      commission: params.commission,
    });
    try {
      await currencyDepositsDatasource.update({
        id: currencyDeposit.id,
        value: newBalance,
      });
    } catch {
      throw ServerErrorException('Failed currency deposit update');
    }
  };

  const getCurrencyDeposit = async ({
    account,
    instrument,
  }: GetCurrencyDeposit): Promise<CurrencyDepositModel> => {
    const currencyDeposit =
      await currencyDepositsDatasource.getByAccountIdAndCurrencyId({
        accountId: account.id,
        currencyId: instrument.currency_id,
      });
    if (currencyDeposit) {
      return currencyDeposit;
    }
    await currencyDepositsDatasource.create({
      accountId: account.id,
      currencyId: instrument.currency_id,
    });
    return getCurrencyDeposit({ account: account, instrument: instrument });
  };

  return {
    call: async (params) => {
      const {
        accountId,
        instrumentId,
        lots,
        price,
        date,
        commission,
        withdrawFundsFromBalance,
      } = params;
      const instrument = await investInstrumentsDatasource.getById(
        instrumentId,
      );
      if (!instrument) {
        throw NotFoundException({
          id: ExceptionId.investInstrumentNotFound,
          message: 'Invest instrument not found',
        });
      }
      const account = await accountsDatasource.getById(accountId);
      if (!account) {
        throw NotFoundException({
          id: ExceptionId.accountNotFound,
          message: 'Account not found',
        });
      }
      const currencyDeposit = await getCurrencyDeposit({
        account: account,
        instrument: instrument,
      });
      const isGreater = checkTotalPriceIsGreaterAccountBalance(
        params.price,
        currencyDeposit,
        instrument.lot * params.lots,
        params.commission,
      );
      if (withdrawFundsFromBalance && isGreater) {
        throw BadRequestException({
          id: ExceptionId.notEnoughFunds,
          message:
            'You can`t buy this instrument because there are not enough funds on your account',
        });
      }
      const investmentAsset = await getInvestmentAsset(params);
      if (!investmentAsset) {
        throw ServerErrorException('Failed account item creation');
      }
      try {
        await investmentAssetsDatasource.update({
          id: investmentAsset.id,
          lots: investmentAsset.lots + lots,
          averagePurchasePrice: calculateAveragePrice({
            averagePrice: {
              units: investmentAsset.average_purchase_price_units,
              nano: investmentAsset.average_purchase_price_nano,
            },
            lots: investmentAsset.lots,
            newPrice: price,
            newLots: lots,
          }),
        });
      } catch {
        throw ServerErrorException('Failed account item update');
      }
      const id = await tradingOperationsDatasource.create({
        investmentAssetId: investmentAsset.id,
        lots: lots,
        price: price,
        date: date,
        commission: commission,
      });
      if (!checkIdIsCorrect(id)) {
        throw ServerErrorException('Failed sale creation');
      }
      if (withdrawFundsFromBalance) {
        await withdrawFundsFromBalanceFn({
          currencyDeposit: currencyDeposit,
          params: params,
          instrumentLot: instrument.lot,
        });
      }
    },
  };
};

export default CreatePurchaseUsecaseImpl;

