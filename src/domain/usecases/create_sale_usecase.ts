import BadRequestException from '../../core/exception/bad_request_exception';
import NotFoundException from '../../core/exception/not_found_exception';
import ServerErrorException from '../../core/exception/server_error_exception';
import calculateBalance from '../../core/utils/calculate_utils/calculate_balance';
import checkChangesIsCorrect from '../../core/utils/required_params/check_changes_is_correct';
import checkIdIsCorrect from '../../core/utils/required_params/check_id_is_correct';
import AccountsDatasource from '../../data/datasources/accounts_datasource/accounts_datasource';
import CurrencyDepositsDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import InvestInstrumentsDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import InvestmentAssetsDatasource from '../../data/datasources/investment_assets_datasource/investment_assets_datasource';
import TradingOperationsDatasource from '../../data/datasources/trading_operations_datasource/trading_operations_datasource';
import AccountModel from '../../data/models/account_model';
import CurrencyDepositModel from '../../data/models/currency_deposit_model';
import InvestInstrumentModel from '../../data/models/invest_instrument_model';
import CreateSaleRequestData from '../../presentation/types/request_data/create_sale_request_data';

type Params = {
  investmentAssetsDatasource: InvestmentAssetsDatasource;
  tradingOperationsDatasource: TradingOperationsDatasource;
  accountsDatasource: AccountsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
};

type AddFundsFromSaleToBalanceParams = {
  currencyDeposit: CurrencyDepositModel;
  params: CreateSaleRequestData;
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
  price: number;
  date?: string;
  commission?: number;
  addFundsFromSaleToBalance: boolean;
};

export type CreateSaleUsecase = {
  call: (params: CallMethodParams) => Promise<void>;
};

const CreateSaleUsecaseImpl = ({
  investmentAssetsDatasource,
  tradingOperationsDatasource,
  accountsDatasource,
  investInstrumentsDatasource,
  currencyDepositsDatasource,
}: Params): CreateSaleUsecase => {
  const addFundsFromSaleToBalanceFn = async ({
    currencyDeposit,
    params,
    instrumentLot,
  }: AddFundsFromSaleToBalanceParams) => {
    const newBalance = calculateBalance({
      balance: currencyDeposit.value,
      price: params.price,
      lots: params.lots * instrumentLot,
      commission: params.commission,
    });
    const currencyDepositsChanges = await currencyDepositsDatasource.update({
      id: currencyDeposit.id,
      value: newBalance,
    });
    if (!checkChangesIsCorrect(currencyDepositsChanges)) {
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
        currencyId: instrument.currencyId,
      });
    if (currencyDeposit) {
      return currencyDeposit;
    }
    await currencyDepositsDatasource.create({
      accountId: account.id,
      currencyId: instrument.currencyId,
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
        addFundsFromSaleToBalance,
      } = params;
      const account = await accountsDatasource.getById(accountId);
      if (!account) {
        throw NotFoundException('Account not found');
      }
      const instrument = await investInstrumentsDatasource.getById(
        instrumentId,
      );
      if (!instrument) {
        throw NotFoundException('Invest instrument not found');
      }
      const investmentAsset =
        await investmentAssetsDatasource.getByAccountIdAndInstrumentId(
          accountId,
          instrumentId,
        );
      if (!investmentAsset) {
        throw BadRequestException(
          'You can`t sell this instrument because it is not in your account',
        );
      }
      if (lots > investmentAsset.lots) {
        throw BadRequestException(
          'You can`t sell this instrument, because the number of lots on the account is less than you want to sell',
        );
      }
      const investmentAssetsChanges = await investmentAssetsDatasource.update({
        id: investmentAsset.id,
        lots: investmentAsset.lots - lots,
      });
      if (!checkChangesIsCorrect(investmentAssetsChanges)) {
        throw ServerErrorException('Failed account item update');
      }
      const id = await tradingOperationsDatasource.create({
        investmentAssetId: investmentAsset.id,
        lots: -lots,
        price: price,
        date: date,
        commission: commission,
      });
      if (!checkIdIsCorrect(id)) {
        throw ServerErrorException('Failed sale creation');
      }
      const currencyDeposit = await getCurrencyDeposit({
        account: account,
        instrument: instrument,
      });
      if (addFundsFromSaleToBalance) {
        await addFundsFromSaleToBalanceFn({
          currencyDeposit: currencyDeposit,
          params: params,
          instrumentLot: instrument.lot,
        });
      }
    },
  };
};

export default CreateSaleUsecaseImpl;
