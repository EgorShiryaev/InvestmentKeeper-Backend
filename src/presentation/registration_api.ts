import Api from './api';
import UserRepository from '../data/repositories/user_repository';
import checkRequiredParams from '../core/utils/check_required_params';
import generateRequiredParamsError from '../core/utils/generate_required_params_error';
import UserEntity from '../domain/entities/user';
import generateBearerToken from '../core/utils/generate_bearer_token';

type Params = {
    repository: UserRepository;
};

const RegistrationApi = ({ repository }: Params): Api => {
  const requiredParams = ['name', 'password', 'email'];

  return {
    handler: (request, response) => {
      if (!checkRequiredParams(request.body, requiredParams)) {
        const error = generateRequiredParamsError(
          request.body,
          requiredParams,
        );
        response.status(400).json({ error: error });
        return;
      }
      const newUser: UserEntity = request.body;

      repository
        .add(newUser)
        .then(() => repository.getByEmail(newUser.email))
        .then((user) => {
          generateBearerToken(user, (error, token) => {
            if (token) {
              response.status(200).json({ token: token });
              return;
            }
            response.status(500).json(error);
          });
        })
        .catch((exception) => {
          response.status(500).json(exception);
        });
    },
  };
};

export default RegistrationApi;

