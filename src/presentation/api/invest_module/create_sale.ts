import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import calculateCurrencyBalance from '../../../core/utils/calculate_utils/calculate_balance';
import checkChangesIsCorrect from '../../../core/utils/required_params/check_changes_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountItemsDatasource from '../../../data/datasources/account_items_datasource/account_items_datasource';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import SalesDatasource from '../../../data/datasources/sales_datasource/sales_datasource';
import StatusCode from '../../../domain/entities/status_code';
import CreateSaleRequestData from '../../types/request_data/create_sale_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import AccountModel from '../../../data/models/account_model';
import calculateAccountTotalCommission from '../../../core/utils/calculate_utils/calculate_account_total_commission';
import checkIsIsoDate from '../../../core/utils/required_params/check_is_iso_date';

type Params = {
  accountItemsDatasource: AccountItemsDatasource;
  salesDatasource: SalesDatasource;
  accountsDatasource: AccountsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

type AddFundsFromSaleToCurrencyBalanceParams = {
  account: AccountModel;
  params: CreateSaleRequestData;
  instrumentLot: number;
};

const CreateSale = ({
  accountItemsDatasource,
  salesDatasource,
  accountsDatasource,
  investInstrumentsDatasource,
}: Params): ApiMethod => {
  const requiredParams = [
    'accountId',
    'instrumentId',
    'lots',
    'price',
    'addFundsFromSaleToCurrencyBalance',
  ];

  const addFundsFromSaleToCurrencyBalance = async ({
    account,
    params,
    instrumentLot,
  }: AddFundsFromSaleToCurrencyBalanceParams) => {
    const newCurrencyBalance = calculateCurrencyBalance({
      currencyBalance: account.currencyBalance,
      price: params.price,
      lots: params.lots * instrumentLot,
      isAddition: true,
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
        const accountItem =
          await accountItemsDatasource.getByAccountIdAndInstrumentId(
            params.accountId,
            params.instrumentId,
          );
        if (!accountItem) {
          throw BadRequestException(
            'You can`t sell this instrument because it is not in your account',
          );
        }
        if (params.lots > accountItem.lots) {
          throw BadRequestException(
            'You can`t sell this instrument, because the number of lots on the account is less than you want to sell',
          );
        }
        const accountItemsChanges = await accountItemsDatasource.update({
          id: accountItem.id,
          lots: accountItem.lots - params.lots,
        });
        if (!checkChangesIsCorrect(accountItemsChanges)) {
          throw ServerErrorException('Failed account item update');
        }
        const id = await salesDatasource.create({
          accountItemId: accountItem.id,
          lots: params.lots,
          price: params.price,
          date: params.date,
          commission: params.commission,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed sale creation');
        }
        if (params.addFundsFromSaleToCurrencyBalance) {
          await addFundsFromSaleToCurrencyBalance({
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

export default CreateSale;

