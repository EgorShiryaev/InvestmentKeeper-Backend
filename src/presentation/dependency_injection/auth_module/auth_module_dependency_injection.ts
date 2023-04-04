import { SqlDatabase } from '../../../data/databases/types';
import UserLocalDatasource from '../../../data/datasources/user_datasource/user_local_datasource';
import UserRepositoryImpl from '../../../domain/repositories/user_repository/user_repository_impl';
import LoginApi from '../../apis/login_api';
import RegistrationApi from '../../apis/registration_api';
import AuthModule from './auth_module';

const authModuleDependencyInjection = (
  sqlDatabase: SqlDatabase,
): AuthModule => {
  const userLocalDatasource = UserLocalDatasource({
    sqlDatabase: sqlDatabase,
  });

  const userRepository = UserRepositoryImpl({
    localDatasource: userLocalDatasource,
  });

  const registrationApi = RegistrationApi({
    repository: userRepository,
  });
  const loginApi = LoginApi({
    repository: userRepository,
  });

  return {
    registration: registrationApi,
    login: loginApi,
  };
};

export default authModuleDependencyInjection;
