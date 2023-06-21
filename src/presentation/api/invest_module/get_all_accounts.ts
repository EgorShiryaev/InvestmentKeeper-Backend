import { IException } from '../../../core/exception/exception';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import ErrorResponseData from '../../types/response_data/error_response_data';
import GetAccountsResponseData from '../../types/response_data/get_accounts_response_data';
import ApiMethod from '../../types/methods/api_method';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { GetAllAccountsUsecase } from '../../../domain/usecases/get_all_accounts_usecase';
import getCodeAndResponseDataByException from '../../../core/utils/response_utils/send_error_reponse_by_exception';

type Params = {
  getAllAccountsUsecase: GetAllAccountsUsecase;
};

const GetAllAccounts = ({ getAllAccountsUsecase }: Params): ApiMethod => {
  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const user = getAuthedUser(request.headers);
        const accounts = await getAllAccountsUsecase.call(user.id);
        const responseData: GetAccountsResponseData = {
          accounts: accounts,
        };
        response.status(StatusCode.success).json(responseData);
      } catch (error) {
        const { statusCode, responseData } = getCodeAndResponseDataByException(
          error as IException,
        );
        response.status(statusCode).json(responseData);
      }
    },
  };
};

export default GetAllAccounts;

