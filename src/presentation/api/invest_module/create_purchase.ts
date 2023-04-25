import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import calculateAveragePrice from '../../../core/utils/calculate_utils/calculate_average_price';
import calculateBalance from '../../../core/utils/calculate_utils/calculate_balance';
import calculateTotalPrice from '../../../core/utils/calculate_utils/calculate_total_price';
import checkChangesIsCorrect from '../../../core/utils/check_changes_is_correct';
import checkIdIsCorrect from '../../../core/utils/check_id_is_correct';
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
import CreateSaleRequestData from '../../types/request_data/create_sale_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../api';

type Params = {
  accountItemsDatasource: AccountItemsDatasource;
  purchasesDatasource: SalesDatasource;
  accountsDatasource: AccountsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

const CreatePurchase = ({
  accountItemsDatasource,
  purchasesDatasource,
  accountsDatasource,
  investInstrumentsDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['accountId', 'instrumentId', 'lots', 'price'];

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

  const checkTotalPriceIsGreaterAccountBalance = (
    params: CreatePurchaseRequestData,
    account: AccountModel,
  ) => {
    const totalPrice = calculateTotalPrice({
      price: params.price,
      lots: params.lots,
    });
    return totalPrice > account.balance;
  };

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateSaleRequestData = request.body;
        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
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
        if (checkTotalPriceIsGreaterAccountBalance(params, account)) {
          throw BadRequestException(
            'You can`t buy this instrument because there are not enough funds on your account',
          );
        }
        const accountItem = await getAccountItem(params);
        if (!accountItem) {
          throw ServerErrorException('Failed account item creation');
        }
        const newAveragePrice = calculateAveragePrice({
          price: accountItem.averagePrice,
          lots: accountItem.lots,
          newPrice: params.price,
          newLots: params.lots,
        });
        const accountItemsChanges = await accountItemsDatasource.update({
          id: accountItem.id,
          lots: accountItem.lots + params.lots,
          averagePrice: newAveragePrice,
        });
        if (!checkChangesIsCorrect(accountItemsChanges)) {
          throw ServerErrorException('Failed account item update');
        }
        const id = await purchasesDatasource.create({
          accountItemId: accountItem.id,
          lots: params.lots,
          price: params.price,
        });

        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed sale creation');
        }
        const newBalance = calculateBalance({
          balance: account.balance,
          price: params.price,
          lots: params.lots,
          isAddition: false,
        });
        const accountsChanges = await accountsDatasource.update({
          id: account.id,
          balance: newBalance,
        });
        if (!checkChangesIsCorrect(accountsChanges)) {
          throw ServerErrorException('Failed account item update');
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

