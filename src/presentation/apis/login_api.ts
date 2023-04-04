import ExceptionType from '../../core/exceptions/exception_type';
import FailureAuthException from '../../core/exceptions/failure_auth_exception';
import checkRequiredParams from '../../core/utils/required_params/check_required_params';
import { compareEncodedPassword } from '../../core/utils/encoded_password/compare_encoded_password';
import generateAuthToken from '../../core/utils/auth_token/generate_auth_token';
import generateRequiredParamsError from '../../core/utils/required_params/generate_required_params_error';
import UserRepository from '../../domain/repositories/user_repository/user_repository';
import AuthData from '../../domain/entities/api_data/auth_data';
import StatusCode from '../status_codes/status_code';
import Api from './api';
import { IException } from '../../core/exceptions/exception';
import { addUserToAuthTokenUserRepository } from '../../core/utils/auth_token/auth_token_user_repository';

type Params = {
  repository: UserRepository;
};

const LoginApi = ({ repository }: Params): Api => {
  const requiredParams = ['password', 'email'];

  return {
    handler: async (request, response) => {
      console.log(request.method, request.url);

      if (!checkRequiredParams(request.body, requiredParams)) {
        const error = generateRequiredParamsError(request.body, requiredParams);
        response.status(StatusCode.badRequest).json({ error: error });
        return;
      }
      const authData: AuthData = request.body;

      try {
        const user = await repository.getByEmail(authData.email);
        const passwordIsCompared = await compareEncodedPassword({
          password: authData.password,
          hash: user.password,
        });
        if (!passwordIsCompared) {
          throw FailureAuthException();
        }
        const token = generateAuthToken(user);
        addUserToAuthTokenUserRepository(token, user);
        response.status(StatusCode.success).json({ token: token });
      } catch (error) {
        const exception = error as IException;
        if (exception?.type === ExceptionType.notFoundException) {
          response.status(StatusCode.authFailure).json(FailureAuthException());
          return;
        }
        response.status(StatusCode.serverError).json(exception);
      }
    },
  };
};

export default LoginApi;

