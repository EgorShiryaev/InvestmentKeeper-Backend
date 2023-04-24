import UsersLocalDatasource from '../../data/datasources/users_datasource/users_local_datasource';
import IsUser from '../../presentation/api/auth_module/is_user';
import Login from '../../presentation/api/auth_module/login';
import Registration from '../../presentation/api/auth_module/registration';
import AuthModule from '../../presentation/types/modules/auth_module';
import ModuleDIParams from './module_di_params';

const authModuleDependencyInjection = ({
  sqlDatabase,
  authentificatedUsersRepository,
}: ModuleDIParams): AuthModule => {
  const usersDatasource = UsersLocalDatasource({ sqlDatabase });

  const login = Login({
    datasource: usersDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });

  const registration = Registration({
    datasource: usersDatasource,
    authentificatedUsersRepository: authentificatedUsersRepository,
  });

  const isUser = IsUser({
    datasource: usersDatasource,
  });

  return {
    login: login,
    registration: registration,
    isUser: isUser,
  };
};

export default authModuleDependencyInjection;

