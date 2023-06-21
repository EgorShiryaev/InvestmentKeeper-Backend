import { IException } from '../../../core/exception/exception';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import GetAccountResponseData from '../../types/response_data/get_account_response_data';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { GetAccountUsecase } from '../../../domain/usecases/get_account_usecase';

type Params = {
  getAccountUsecase: GetAccountUsecase;
};

const GetAccount = ({ getAccountUsecase }: Params): ApiMethod => {
  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        getAuthedUser(request.headers);
        const id = parseInt(request.params.id);
        const acccount = await getAccountUsecase.call(id);
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
          id: exception.id,
          message: exception.message,
        };
        response.status(statusCode).json(errorResponseData);
      }
    },
  };
};

export default GetAccount;

