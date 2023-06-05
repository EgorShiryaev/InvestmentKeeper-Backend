import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import StatusCode from '../../../domain/entities/status_code';
import LoginRequestData from '../../types/request_data/login_request_data';
import ApiMethod from '../../types/methods/api_method';
import { IException } from '../../../core/exception/exception';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import ErrorResponseData from '../../types/response_data/error_response_data';
import { LoginUsecase } from '../../../domain/usecases/login_usecase';

type Params = {
  loginUsecase: LoginUsecase;
};

const Login = ({ loginUsecase }: Params): ApiMethod => {
  const requiredParams = ['password', 'phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: LoginRequestData = request.body;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        const responseData = await loginUsecase.call({
          password: params.password,
          phoneNumber: params.phoneNumber,
        });
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

export default Login;

