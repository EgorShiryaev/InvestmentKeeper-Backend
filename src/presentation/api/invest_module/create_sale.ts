import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import calculateBalance from '../../../core/utils/calculate_utils/calculate_balance';
import checkChangesIsCorrect from '../../../core/utils/check_changes_is_correct';
import checkIdIsCorrect from '../../../core/utils/check_id_is_correct';
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
import ApiMethod from '../api';

type Params = {
  accountItemsDatasource: AccountItemsDatasource;
  salesDatasource: SalesDatasource;
  accountsDatasource: AccountsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

const CreateSale = ({
  accountItemsDatasource,
  salesDatasource,
  accountsDatasource,
  investInstrumentsDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['accountId', 'instrumentId', 'lots', 'price'];

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
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed sale creation');
        }
        const newBalance = calculateBalance({
          balance: account.balance,
          price: params.price,
          lots: params.lots,
          isAddition: true,
        });
        const accountsChanges = await accountsDatasource.update({
          id: params.accountId,
          balance: newBalance,
        });
        if (!checkChangesIsCorrect(accountsChanges)) {
          throw ServerErrorException('Failed account update');
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

