import Api from './api';
import UserRepository from '../data/repositories/user_repository';
import checkRequiredParams from '../core/utils/check_required_params';
import generateRequiredParamsError from '../core/utils/generate_required_params_error';
import UserEntity from '../domain/entities/user';
import generateBearerToken from '../core/utils/generate_bearer_token';
import StatusCode from '../core/status_codes/status_code';

type Params = {
    repository: UserRepository;
};

const RegistrationApi = ({ repository }: Params): Api => {
  const requiredParams = ['name', 'password', 'email'];

  return {
    handler: (request, response) => {
      console.log(request.method, request.url);
      if (!checkRequiredParams(request.body, requiredParams)) {
        const error = generateRequiredParamsError(
          request.body,
          requiredParams,
        );
        response.status(StatusCode.badRequest).json({ error: error });
        return;
      }
      const newUser: UserEntity = request.body;

      repository
        .add(newUser)
        .then(() => repository.getByEmail(newUser.email))
        .then((user) => {
          generateBearerToken(user, (error, token) => {
            if (token) {
              response.status(StatusCode.success).json({ token: token });
              return;
            }
            response.status(StatusCode.serverError).json(error);
          });
        })
        .catch((exception) => {
          response.status(StatusCode.serverError).json(exception);
        });
    },
  };
};

export default RegistrationApi;

