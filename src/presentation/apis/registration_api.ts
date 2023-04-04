import Api from './api';
import UserRepository from '../../domain/repositories/user_repository/user_repository';
import checkRequiredParams from '../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../core/utils/required_params/generate_required_params_error';
import UserEntity from '../../domain/entities/user/user';
import generateAuthToken from '../../core/utils/auth_token/generate_auth_token';
import StatusCode from '../status_codes/status_code';
import { IException } from '../../core/exceptions/exception';
import { addUserToAuthTokenUserRepository } from '../../core/utils/auth_token/auth_token_user_repository';

type Params = {
  repository: UserRepository;
};

const RegistrationApi = ({ repository }: Params): Api => {
  const requiredParams = ['name', 'password', 'email'];

  return {
    handler: async (request, response) => {
      console.log(request.method, request.url);
      if (!checkRequiredParams(request.body, requiredParams)) {
        const error = generateRequiredParamsError(request.body, requiredParams);
        response.status(StatusCode.badRequest).json({ error: error });
        return;
      }
      const newUser: UserEntity = request.body;

      try {
        await repository.add(newUser);
        const user = await repository.getByEmail(newUser.email);
        const token = generateAuthToken(user);
        addUserToAuthTokenUserRepository(token, user);
        response.status(StatusCode.success).json({ token: token });
      } catch (error) {
        const exception = error as IException;
        response.status(StatusCode.serverError).json(exception);
      }
    },
  };
};

export default RegistrationApi;

