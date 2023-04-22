import FailureAuthException from '../../../core/exceptions/failure_auth_exception';
import generateAuthToken from '../../../core/utils/auth_token/generate_auth_token';
import { compareEncodedPassword } from '../../../core/utils/encoded_password/compare_encoded_password';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../../core/utils/required_params/generate_required_params_error';
import UsersDatasource from '../../../data/datasources/users_datasource/users_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import AuthResponseData from '../../types/response_data/auth_response_data';
import LoginRequestData from '../../types/request_data/login_request_data';
import ApiMethod from '../api';

type Params = {
  datasource: UsersDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const Login = ({
  datasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['password', 'email'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);

        if (!checkRequiredParams(request.body, requiredParams)) {
          const error = generateRequiredParamsError(
            request.body,
            requiredParams,
          );
          response.status(StatusCode.badRequest).json({ error: error });
          return;
        }

        const loginData: LoginRequestData = request.body;

        const user = await datasource.getByEmail(loginData.email);
        if (!user) {
          response
            .status(StatusCode.authFailure)
            .json(FailureAuthException());
          return;
        }

        const passwordIsCompared = await compareEncodedPassword({
          password: loginData.password,
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

