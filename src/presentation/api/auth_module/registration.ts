import CreateException from '../../../core/exceptions/create_exception';
import FailureAuthException from '../../../core/exceptions/failure_auth_exception';
import RecordAlreadyExistsException from '../../../core/exceptions/record_already_exists_exception';
import generateAuthToken from '../../../core/utils/auth_token/generate_auth_token';
import { compareEncodedPassword } from '../../../core/utils/encoded_password/compare_encoded_password';
import { encodePassword } from '../../../core/utils/encoded_password/encode_password';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../../core/utils/required_params/generate_required_params_error';
import UsersDatasource from '../../../data/datasources/users_datasource/users_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import RegistrationRequestData from '../../types/request_data/registration_request_data';
import AuthResponseData from '../../types/response_data/auth_response_data';
import ApiMethod from '../api';


type Params = {
  datasource: UsersDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const Registration = ({
  datasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['name', 'password', 'email'];

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

        const registrationData: RegistrationRequestData = request.body;
        const userIsAlreadyExists = !!(await datasource.getByEmail(
          registrationData.email,
        ));

        if (userIsAlreadyExists) {
          response
            .status(StatusCode.badRequest)
            .json(RecordAlreadyExistsException());
          return;
        }

        const newUser = {
          ...registrationData,
          password: await encodePassword(registrationData.password),
        };

        const id = await datasource.create(newUser);
        if (!id && id !== 0) {
          response.status(StatusCode.serverError).json(CreateException());
          return;
        }

        const user = {
          id: id,
          ...newUser,
        };

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

export default Registration;

