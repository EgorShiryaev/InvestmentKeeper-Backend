import BadRequestException from '../../core/exception/bad_request_exception';
import ExceptionId from '../../core/exception/exception_id';
import ServerErrorException from '../../core/exception/server_error_exception';
import generateAuthToken from '../../core/utils/auth_token/generate_auth_token';
import { encodePassword } from '../../core/utils/encoded_password/encode_password';
import checkIdIsCorrect from '../../core/utils/required_params/check_id_is_correct';
import UsersDatasource from '../../data/datasources/users_datasource/users_datasource';
import UserModel from '../../data/models/user_model';
import AuthResponseData from '../../presentation/types/response_data/auth_response_data';
import AuthentificatedUsersRepository from '../repositories/authentificated_users_repository';

type Params = {
  usersDatasource: UsersDatasource;
};

type CallMethodParams = {
  phoneNumber: string;
  password: string;
  name: string;
};

export type RegistrationUsecase = {
  call: (params: CallMethodParams) => Promise<AuthResponseData>;
};

const RegistrationUsecaseImpl = ({
  usersDatasource,
}: Params): RegistrationUsecase => {
  return {
    call: async ({ phoneNumber, password, name }) => {
      const userModel = await usersDatasource.getByPhoneNumber(phoneNumber);
      const userIsAlreadyExists = !!userModel;
      if (userIsAlreadyExists) {
        throw BadRequestException({
          id: ExceptionId.userIsAlreadyExists,
          message: 'User is already exists',
        });
      }
      const newUser = {
        name: name,
        phoneNumber: phoneNumber,
        password: await encodePassword(password),
      };
      const id = await usersDatasource.create(newUser);
      if (!checkIdIsCorrect(id)) {
        throw ServerErrorException('Failed user creation');
      }
      const user: UserModel = {
        id: id,
        name: name,
        phone_number: phoneNumber,
        password: await encodePassword(password),
      };
      const token = generateAuthToken(user);
      AuthentificatedUsersRepository.set(token, user);
      return {
        token: token,
        name: user.name,
      };
    },
  };
};

export default RegistrationUsecaseImpl;

