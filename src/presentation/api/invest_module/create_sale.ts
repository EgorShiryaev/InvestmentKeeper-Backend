import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import calculateBalance from '../../../core/utils/calculate_utils/calculate_balance';
import checkChangesIsCorrect from '../../../core/utils/required_params/check_changes_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import InvestmentAssetsDatasource from '../../../data/datasources/investment_assets_datasource/investment_assets_datasource';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import TradingOperationsDatasource from '../../../data/datasources/trading_operations_datasource/trading_operations_datasource';
import StatusCode from '../../../domain/entities/status_code';
import CreateSaleRequestData from '../../types/request_data/create_sale_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import AccountModel from '../../../data/models/account_model';
import checkIsIsoDateFormat from '../../../core/utils/required_params/check_is_iso_date_format';
import CurrencyDepositsDatasource from '../../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import CurrencyDepositModel from '../../../data/models/currency_deposit_model';
import InvestInstrumentModel from '../../../data/models/invest_instrument_model';

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

const CreateSale = ({
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
    'addFundsFromSaleToBalance',
  ];

  const addFundsFromSaleToBalance = async ({
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
    const accountsChanges = await currencyDepositsDatasource.update({
      id: params.accountId,
      value: newBalance,
    });
    if (!checkChangesIsCorrect(accountsChanges)) {
      throw ServerErrorException('Failed account update');
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
        const params: CreateSaleRequestData = request.body;
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
          throw BadRequestException('commission should be is integer');
        }
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const account = await accountsDatasource.getById(params.accountId);
        if (!account) {
          throw NotFoundException('Account not found');
        }
        const instrument = await investInstrumentsDatasource.getById(
          params.instrumentId,
        );
        if (!instrument) {
          throw NotFoundException('Invest instrument not found');
        }
        const investmentAsset =
          await investmentAssetsDatasource.getByAccountIdAndInstrumentId(
            params.accountId,
            params.instrumentId,
          );
        if (!investmentAsset) {
          throw BadRequestException(
            'You can`t sell this instrument because it is not in your account',
          );
        }
        if (params.lots > investmentAsset.lots) {
          throw BadRequestException(
            'You can`t sell this instrument, because the number of lots on the account is less than you want to sell',
          );
        }
        const investmentAssetsChanges = await investmentAssetsDatasource.update(
          {
            id: investmentAsset.id,
            lots: investmentAsset.lots - params.lots,
          },
        );
        if (!checkChangesIsCorrect(investmentAssetsChanges)) {
          throw ServerErrorException('Failed account item update');
        }
        const id = await tradingOperationsDatasource.create({
          investmentAssetId: investmentAsset.id,
          lots: -params.lots,
          price: params.price,
          date: params.date,
          commission: params.commission,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed sale creation');
        }
        const currencyDeposit = await getCurrencyDeposit({
          account: account,
          instrument: instrument,
        });
        if (params.addFundsFromSaleToBalance) {
          await addFundsFromSaleToBalance({
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

export default CreateSale;

