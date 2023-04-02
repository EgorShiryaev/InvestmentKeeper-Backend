import Api from './api';
import UserRepository from '../data/repositories/user_repository';
import checkRequiredParams from '../core/utils/check_required_params';
import generateRequiredParamsError from '../core/utils/generate_required_params_error';
import generateBearerToken from '../core/utils/generate_bearer_token';
import ExceptionType from '../core/exceptions/exception_type';
import { compareEncodedPassword } from '../core/utils/crypt_password';
import AuthData from '../domain/entities/auth_data';
import UserModel from '../data/models/user';
import StatusCode from '../core/status_codes/status_code';
import FailureAuthException from '../core/exceptions/failure_auth_exception';

type Params = {
  repository: UserRepository;
};

const LoginApi = ({ repository }: Params): Api => {
  const requiredParams = ['password', 'email'];

  return {
    handler: (request, response) => {
      console.log(request.method, request.url);

      if (!checkRequiredParams(request.body, requiredParams)) {
        const error = generateRequiredParamsError(request.body, requiredParams);
        response.status(StatusCode.badRequest).json({ error: error });
        return;
      }
      const authData: AuthData = request.body;
      let user: UserModel;

      repository
        .getByEmail(authData.email)
        .then(async (record) => {
          user = record;
          return compareEncodedPassword({
            password: authData.password,
            hash: record.password,
          });
        })
        .then((areCompared) => {
          if (areCompared) {
            generateBearerToken(user, (error, token) => {
              if (token) {
                response.status(StatusCode.success).json({ token: token });
                return;
              }
              response.status(StatusCode.serverError).json(error);
            });
            return;
          }
          response.status(StatusCode.authFailure).json(FailureAuthException());
        })
        .catch((exception) => {
          if (exception?.type === ExceptionType.notFoundException) {
            response
              .status(StatusCode.authFailure)
              .json(FailureAuthException());
            return;
          }
          response.status(500).json(exception);
        });
    },
  };
};

export default LoginApi;

