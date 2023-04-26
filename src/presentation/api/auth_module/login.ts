import generateAuthToken from '../../../core/utils/auth_token/generate_auth_token';
import { compareEncodedPassword } from '../../../core/utils/encoded_password/compare_encoded_password';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import UsersDatasource from '../../../data/datasources/users_datasource/users_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository';
import AuthResponseData from '../../types/response_data/auth_response_data';
import LoginRequestData from '../../types/request_data/login_request_data';
import ApiMethod from '../../types/methods/api_method';
import { IException } from '../../../core/exception/exception';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import BadRequestException from '../../../core/exception/bad_request_exception';
import FailedAuthException from '../../../core/exception/failed_auth_exception';
import ErrorResponseData from '../../types/response_data/error_response_data';

type Params = {
  usersDatasource: UsersDatasource;
};

const Login = ({ usersDatasource }: Params): ApiMethod => {
  const requiredParams = ['password', 'phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: LoginRequestData = request.body;
        const checkResult = checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        const user = await usersDatasource.getByPhoneNumber(params.phoneNumber);
        if (!user) {
          throw FailedAuthException();
        }
        const passwordIsCompared = await compareEncodedPassword({
          password: params.password,
          hash: user.password,
        });
        if (!passwordIsCompared) {
          throw FailedAuthException();
        }
        const token = generateAuthToken(user);
        AuthentificatedUsersRepository.set(token, user);
        const responseData: AuthResponseData = {
          token: token,
          name: user.name,
        };
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

