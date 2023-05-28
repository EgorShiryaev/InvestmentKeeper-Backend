import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import StatusCode from '../../../domain/entities/status_code';
import CreateAccountRequestData from '../../types/request_data/create_accounts_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import CurrencyDepositsDatasource from '../../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import CurrenciesDatasource from '../../../data/datasources/currencies_datasource/currencies_datasource';
import NotFoundException from '../../../core/exception/not_found_exception';

type Params = {
  accountsDatasource: AccountsDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
  currenciesDatasource: CurrenciesDatasource;
};

const CreateAccount = ({
  accountsDatasource,
  currencyDepositsDatasource,
  currenciesDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['title', 'currency'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateAccountRequestData = request.body;
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
        const currency = await currenciesDatasource.get({
          value: params.currency,
        });
        if (!currency) {
          throw NotFoundException('Currency not found');
        }
        const id = await accountsDatasource.create({
          userId: user.id,
          ...params,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed account creation');
        }
        const currencyDepositsId = await currencyDepositsDatasource.create({
          currencyId: currency.id,
          accountId: id,
        });
        if (!checkIdIsCorrect(currencyDepositsId)) {
          throw ServerErrorException('Failed currency deposit creation');
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

export default CreateAccount;

