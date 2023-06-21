import { IException } from '../../../core/exception/exception';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import UpdateAccountRequestData from '../../types/request_data/update_account_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { UpdateAccountUsecase } from '../../../domain/usecases/update_account_usecase';
import getCodeAndResponseDataByException from '../../../core/utils/response_utils/send_error_reponse_by_exception';

type Params = {
  updateAccountUsecase: UpdateAccountUsecase;
};

const UpdateAccount = ({ updateAccountUsecase }: Params): ApiMethod => {
  const requiredParams = ['id', 'title'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: UpdateAccountRequestData = request.body;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        getAuthedUser(request.headers);
        updateAccountUsecase.call({
          id: params.id,
          title: params.title,
        });
        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        const { statusCode, responseData } = getCodeAndResponseDataByException(
          error as IException,
        );
        response.status(statusCode).json(responseData);
      }
    },
  };
};

export default UpdateAccount;

