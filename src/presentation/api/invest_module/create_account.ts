import { IException } from '../../../core/exception/exception';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import CreateAccountRequestData from '../../types/request_data/create_accounts_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import { CreateAccountUsecase } from '../../../domain/usecases/create_account_usecase';
import getAuthedUser from '../../../core/utils/get_auth_user';
import getCodeAndResponseDataByException from '../../../core/utils/response_utils/send_error_reponse_by_exception';

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
        const user = getAuthedUser(request.headers);
        await createAccountUsecase.call({
          title: params.title,
          currencyName: params.currency,
          user: user,
        });
        response.sendStatus(StatusCode.created);
      } catch (error) {
        const { statusCode, responseData } = getCodeAndResponseDataByException(
          error as IException,
        );
        response.status(statusCode).json(responseData);
      }
    },
  };
};

export default CreateAccount;

