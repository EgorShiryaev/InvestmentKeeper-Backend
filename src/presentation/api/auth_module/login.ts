import FailureAuthException from '../../../core/exceptions/failure_auth_exception';
import generateAuthToken from '../../../core/utils/auth_token/generate_auth_token';
import { compareEncodedPassword } from '../../../core/utils/encoded_password/compare_encoded_password';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import UsersDatasource from '../../../data/datasources/users_datasource/users_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import AuthResponseData from '../../types/response_data/auth_response_data';
import LoginRequestData from '../../types/request_data/login_request_data';
import ApiMethod from '../api';
import ErrorResponseData from '../../types/response_data/error_response_data';

type Params = {
  datasource: UsersDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const Login = ({
  datasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['password', 'phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);

        const params: LoginRequestData = request.body;

        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          const responseData: ErrorResponseData = {
            error: checkResult.message,
          };
          response.status(StatusCode.badRequest).json(responseData);
          return;
        }

        const user = await datasource.getByPhoneNumber(params.phoneNumber);
        if (!user) {
          response.status(StatusCode.authFailure).json(FailureAuthException());
          return;
        }

        const passwordIsCompared = await compareEncodedPassword({
          password: params.password,
          hash: user.password,
        });
        if (!passwordIsCompared) {
          response.status(StatusCode.authFailure).json(FailureAuthException());
          return;
        }

        const token = generateAuthToken(user);
        authentificatedUsersRepository.set(token, user);
        const responseData: AuthResponseData = {
          token: token,
          name: user.name,
        };
        response.status(StatusCode.success).json(responseData);
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default Login;

