import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import calculateAveragePrice from '../../../core/utils/calculate_utils/calculate_average_price';
import calculateCurrencyBalance from '../../../core/utils/calculate_utils/calculate_balance';
import calculateTotalPrice from '../../../core/utils/calculate_utils/calculate_total_price';
import checkChangesIsCorrect from '../../../core/utils/required_params/check_changes_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountItemsDatasource from '../../../data/datasources/account_items_datasource/account_items_datasource';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import SalesDatasource from '../../../data/datasources/sales_datasource/sales_datasource';
import AccountModel from '../../../data/models/account_model';
import StatusCode from '../../../domain/entities/status_code';
import CreatePurchaseRequestData from '../../types/request_data/create_purchase_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import InvestInstrumentModel from '../../../data/models/invest_instrument_model';
import checkIsIsoDate from '../../../core/utils/required_params/check_is_iso_date';
import calculateAccountTotalCommission from '../../../core/utils/calculate_utils/calculate_account_total_commission';

type Params = {
  accountItemsDatasource: AccountItemsDatasource;
  purchasesDatasource: SalesDatasource;
  accountsDatasource: AccountsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

type WithdrawFundsFromCurrencyBalanceParams = {
  account: AccountModel;
  params: CreatePurchaseRequestData;
  instrumentLot: number;
};

const CreatePurchase = ({
  accountItemsDatasource,
  purchasesDatasource,
  accountsDatasource,
  investInstrumentsDatasource,
}: Params): ApiMethod => {
  const requiredParams = [
    'accountId',
    'instrumentId',
    'lots',
    'price',
    'withdrawFundsFromCurrencyBalance',
  ];

  const getAccountItem = async (params: CreatePurchaseRequestData) => {
    const accountItem =
      await accountItemsDatasource.getByAccountIdAndInstrumentId(
        params.accountId,
        params.instrumentId,
      );
    if (accountItem) {
      return accountItem;
    }
    const id = await accountItemsDatasource.create({
      accountId: params.accountId,
      instrumentId: params.instrumentId,
    });

    return accountItemsDatasource.getById(id);
  };

  const checkTotalPriceIsGreaterAccountCurrencyBalance = (
    params: CreatePurchaseRequestData,
    account: AccountModel,
    instrument: InvestInstrumentModel,
  ) => {
    const totalPrice = calculateTotalPrice({
      price: params.price,
      lots: params.lots * instrument.lot,
    });
    return totalPrice > account.currencyBalance;
  };

  const withdrawFundsFromCurrencyBalance = async ({
    account,
    params,
    instrumentLot,
  }: WithdrawFundsFromCurrencyBalanceParams) => {
    const newCurrencyBalance = calculateCurrencyBalance({
      currencyBalance: account.currencyBalance,
      price: params.price,
      lots: params.lots * instrumentLot,
      isAddition: false,
      commission: params.commission,
    });
    const totalCommission = calculateAccountTotalCommission(
      account.totalCommission,
      params.commission,
    );
    const accountsChanges = await accountsDatasource.update({
      id: params.accountId,
      currencyBalance: newCurrencyBalance,
      totalCommission: totalCommission,
    });
    if (!checkChangesIsCorrect(accountsChanges)) {
      throw ServerErrorException('Failed account update');
    }
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
          !checkIsIsoDate(params.date)
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
        if (
          params.withdrawFundsFromCurrencyBalance &&
          checkTotalPriceIsGreaterAccountCurrencyBalance(params, account, instrument)
        ) {
          throw BadRequestException(
            'You can`t buy this instrument because there are not enough funds on your account',
          );
        }
        const accountItem = await getAccountItem(params);
        if (!accountItem) {
          throw ServerErrorException('Failed account item creation');
        }
        const newAveragePrice = calculateAveragePrice({
          price: accountItem.averagePurchasePrice,
          lots: accountItem.lots,
          newPrice: params.price,
          newLots: params.lots,
        });
        const accountItemsChanges = await accountItemsDatasource.update({
          id: accountItem.id,
          lots: accountItem.lots + params.lots,
          averagePurchasePrice: newAveragePrice,
        });
        if (!checkChangesIsCorrect(accountItemsChanges)) {
          throw ServerErrorException('Failed account item update');
        }
        const id = await purchasesDatasource.create({
          accountItemId: accountItem.id,
          lots: params.lots,
          price: params.price,
          date: params.date,
          commission: params.commission,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed sale creation');
        }
        if (params.withdrawFundsFromCurrencyBalance) {
          await withdrawFundsFromCurrencyBalance({
            account: account,
            params: params,
            instrumentLot: instrument.lot,
          });
        }
        response.sendStatus(StatusCode.noContent);
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

