import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import CreateAccountRequestData from '../../types/request_data/create_accounts_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import { CreateAccountUsecase } from '../../../domain/usecases/crate_account_usecase';

type Params = {
  createAccountUsecase: CreateAccountUsecase;
};

const CreateAccount = ({ createAccountUsecase }: Params): ApiMethod => {
  const requiredParams = ['title', 'currency'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateAccountRequestData = request.body;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        await createAccountUsecase.call({
          title: params.title,
          currency: params.currency,
          user: user,
        });
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

