import FailedAuthException from '../../core/exception/failed_auth_exception';
import generateAuthToken from '../../core/utils/auth_token/generate_auth_token';
import { compareEncodedPassword } from '../../core/utils/encoded_password/compare_encoded_password';
import UsersDatasource from '../../data/datasources/users_datasource/users_datasource';
import AuthResponseData from '../../presentation/types/response_data/auth_response_data';
import AuthentificatedUsersRepository from '../repositories/authentificated_users_repository';

type Params = {
  usersDatasource: UsersDatasource;
};

type CallMethodParams = {
    phoneNumber: string;
    password: string;
}

export type LoginUsecase = {
  call: (params:CallMethodParams) => Promise<AuthResponseData>;
};

const LoginUsecaseImpl = ({ usersDatasource }: Params): LoginUsecase => {
  return {
    call: async ({phoneNumber, password}) => {
        const user = await usersDatasource.getByPhoneNumber(phoneNumber);
        if (!user) {
          throw FailedAuthException();
        }
        const passwordIsCompared = await compareEncodedPassword({
          password: password,
          hash: user.password,
        });
        if (!passwordIsCompared) {
          throw FailedAuthException();
        }
        const token = generateAuthToken(user);
        AuthentificatedUsersRepository.set(token, user);
        return {
          token: token,
          name: user.name,
        };
    },
  };
};

export default LoginUsecaseImpl;

