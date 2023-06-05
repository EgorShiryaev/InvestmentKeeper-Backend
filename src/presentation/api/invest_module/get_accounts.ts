import { IException } from '../../../core/exception/exception';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import ErrorResponseData from '../../types/response_data/error_response_data';
import GetAccountsResponseData from '../../types/response_data/get_accounts_response_data';
import ApiMethod from '../../types/methods/api_method';
import GetAccountRequestData from '../../types/request_data/get_account_request_data';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import GetAccountResponseData from '../../types/response_data/get_account_response_data';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { GetAccountsUsecase } from '../../../domain/usecases/get_accounts_usecase';

type Params = {
  getAccountsUsecase: GetAccountsUsecase;
};

const GetAccounts = ({ getAccountsUsecase }: Params): ApiMethod => {
  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const user = getAuthedUser(request.headers);
        const params = request.query as unknown as GetAccountRequestData;
        if (!checkIdIsCorrect(params.id)) {
          const accounts = await getAccountsUsecase.getAllAccounts(user.id);
          const responseData: GetAccountsResponseData = {
            accounts: accounts,
          };
          response.status(StatusCode.success).json(responseData);
          return;
        }
        const acccount = await getAccountsUsecase.getAccount(params.id);
        if (!acccount) {
          response.sendStatus(StatusCode.notFound);
          return;
        }
        const responseData: GetAccountResponseData = acccount;
        response.status(StatusCode.success).json(responseData);
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

export default GetAccounts;

