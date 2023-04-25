import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import generateAuthToken from '../../../core/utils/auth_token/generate_auth_token';
import { encodePassword } from '../../../core/utils/encoded_password/encode_password';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import UsersDatasource from '../../../data/datasources/users_datasource/users_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository';
import RegistrationRequestData from '../../types/request_data/registration_request_data';
import AuthResponseData from '../../types/response_data/auth_response_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../api';

type Params = {
  usersDatasource: UsersDatasource;
};

const Registration = ({ usersDatasource }: Params): ApiMethod => {
  const requiredParams = ['name', 'password', 'phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: RegistrationRequestData = request.body;
        const checkResult = checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        const userIsAlreadyExists = !!(await usersDatasource.getByPhoneNumber(
          params.phoneNumber,
        ));
        if (userIsAlreadyExists) {
          throw BadRequestException('User is already exists');
        }
        const newUser = {
          ...params,
          password: await encodePassword(params.password),
        };
        const id = await usersDatasource.create(newUser);
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed user creation');
        }
        const user = {
          id: id,
          ...newUser,
        };
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

export default Registration;

