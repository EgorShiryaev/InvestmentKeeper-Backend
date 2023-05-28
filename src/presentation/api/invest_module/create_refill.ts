import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import checkChangesIsCorrect from '../../../core/utils/required_params/check_changes_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import FinancialOperationsDatasource from '../../../data/datasources/financial_operations_datasource/financial_operations_datasource';
import StatusCode from '../../../domain/entities/status_code';
import CreateRefillRequestData from '../../types/request_data/create_refill_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import checkIsIsoDateFormat from '../../../core/utils/required_params/check_is_iso_date_format';
import CurrenciesDatasource from '../../../data/datasources/currencies_datasource/currencies_datasource';
import CurrencyDepositsDatasource from '../../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import AccountModel from '../../../data/models/account_model';
import CurrencyDepositModel from '../../../data/models/currency_deposit_model';
import CurrencyModel from '../../../data/models/currency_model';

type Params = {
  financialOperationsDatasource: FinancialOperationsDatasource;
  accountsDatasource: AccountsDatasource;
  currenciesDatasource: CurrenciesDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
};

type GetCurrencyDeposit = {
  account: AccountModel;
  currency: CurrencyModel;
};

const CreateRefill = ({
  financialOperationsDatasource,
  accountsDatasource,
  currenciesDatasource,
  currencyDepositsDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['accountId', 'value', 'currency'];

  const getCurrencyDeposit = async ({
    account,
    currency,
  }: GetCurrencyDeposit): Promise<CurrencyDepositModel> => {
    const currencyDeposit =
      await currencyDepositsDatasource.getByAccountIdAndCurrencyId({
        accountId: account.id,
        currencyId: currency.id,
      });
    if (currencyDeposit) {
      return currencyDeposit;
    }
    await currencyDepositsDatasource.create({
      accountId: account.id,
      currencyId: currency.id,
    });
    return getCurrencyDeposit({ account: account, currency: currency });
  };

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateRefillRequestData = request.body;
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
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const account = await accountsDatasource.getById(params.accountId);
        if (!account) {
          throw NotFoundException('Account not found');
        }
        const currency = await currenciesDatasource.get({
          value: params.currency,
        });
        if (!currency) {
          throw NotFoundException('Currency not found');
        }
        const id = await financialOperationsDatasource.create({
          accountId: params.accountId,
          currencyId: currency.id,
          value: params.value,
          date: params.date,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed refill creation');
        }
        const currencyDeposit = await getCurrencyDeposit({
          account: account,
          currency: currency,
        });
        const newBalance = currencyDeposit.value + params.value;
        const currencyDepositsChanges = await currencyDepositsDatasource.update(
          {
            id: account.id,
            value: newBalance,
          },
        );
        if (!checkChangesIsCorrect(currencyDepositsChanges)) {
          throw ServerErrorException('Failed account item update');
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

export default CreateRefill;

