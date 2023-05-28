import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import calculateAveragePrice from '../../../core/utils/calculate_utils/calculate_average_price';
import calculateBalance from '../../../core/utils/calculate_utils/calculate_balance';
import calculateTotalPrice from '../../../core/utils/calculate_utils/calculate_total_price';
import checkChangesIsCorrect from '../../../core/utils/required_params/check_changes_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import InvestmentAssetsDatasource from '../../../data/datasources/investment_assets_datasource/investment_assets_datasource';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import TradingOperationsDatasource from '../../../data/datasources/trading_operations_datasource/trading_operations_datasource';
import AccountModel from '../../../data/models/account_model';
import StatusCode from '../../../domain/entities/status_code';
import CreatePurchaseRequestData from '../../types/request_data/create_purchase_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import InvestInstrumentModel from '../../../data/models/invest_instrument_model';
import checkIsIsoDateFormat from '../../../core/utils/required_params/check_is_iso_date_format';
import CurrencyDepositsDatasource from '../../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import CurrencyDepositModel from '../../../data/models/currency_deposit_model';

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

const CreatePurchase = ({
  investmentAssetsDatasource,
  tradingOperationsDatasource,
  accountsDatasource,
  investInstrumentsDatasource,
  currencyDepositsDatasource,
}: Params): ApiMethod => {
  const requiredParams = [
    'accountId',
    'instrumentId',
    'lots',
    'price',
    'withdrawFundsFromBalance',
  ];

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

  const checkTotalPriceIsGreaterAccountBalance = (
    params: CreatePurchaseRequestData,
    depositModel: CurrencyDepositModel,
    instrument: InvestInstrumentModel,
  ) => {
    const totalPrice = calculateTotalPrice({
      price: params.price,
      lots: params.lots * instrument.lot,
    });
    return totalPrice > depositModel.value;
  };

  const withdrawFundsFromBalance = async ({
    currencyDeposit,
    params,
    instrumentLot,
  }: WithdrawFundsFromBalanceParams) => {
    const newBalance = calculateBalance({
      balance: currencyDeposit.value,
      price: -params.price,
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
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreatePurchaseRequestData = request.body;
        const checkResult = checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        if (
          params.date !== null &&
          params.date !== undefined &&
          !checkIsIsoDateFormat(params.date)
        ) {
          throw BadRequestException(
            'date should be is string to iso date format',
          );
        }
        if (
          params.commission !== null &&
          params.commission !== undefined &&
          isNaN(params.commission)
        ) {
          throw BadRequestException('commission should be is double');
        }
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const instrument = await investInstrumentsDatasource.getById(
          params.instrumentId,
        );
        if (!instrument) {
          throw NotFoundException('Invest instrument not found');
        }
        const account = await accountsDatasource.getById(params.accountId);
        if (!account) {
          throw NotFoundException('Account not found');
        }
        const currencyDeposit = await getCurrencyDeposit({
          account: account,
          instrument: instrument,
        });
        if (
          params.withdrawFundsFromBalance &&
          checkTotalPriceIsGreaterAccountBalance(
            params,
            currencyDeposit,
            instrument,
          )
        ) {
          throw BadRequestException(
            'You can`t buy this instrument because there are not enough funds on your account',
          );
        }
        const investmentAsset = await getInvestmentAsset(params);
        if (!investmentAsset) {
          throw ServerErrorException('Failed account item creation');
        }
        const investmentAssetsChanges = await investmentAssetsDatasource.update({
          id: investmentAsset.id,
          lots: investmentAsset.lots + params.lots,
          averagePurchasePrice: calculateAveragePrice({
            averagePrice: investmentAsset.averagePurchasePrice,
            lots: investmentAsset.lots,
            newPrice: params.price,
            newLots: params.lots,
          }),
        });
        if (!checkChangesIsCorrect(investmentAssetsChanges)) {
          throw ServerErrorException('Failed account item update');
        }
        const id = await tradingOperationsDatasource.create({
          investmentAssetId: investmentAsset.id,
          lots: params.lots,
          price: params.price,
          date: params.date,
          commission: params.commission,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed sale creation');
        }
        if (params.withdrawFundsFromBalance) {
          await withdrawFundsFromBalance({
            currencyDeposit: currencyDeposit,
            params: params,
            instrumentLot: instrument.lot,
          });
        }
        response.sendStatus(StatusCode.created);
      } catch (error) {
        const exception = error as IException;
        const statusCode = getStatusCodeByExceptionCode(exception.code);
        const errorResponseData: ErrorResponseData = {
          message: exception.message,
        };
        response.status(statusCode).json(errorResponseData);
      }
    },
  };
};

export default CreatePurchase;

