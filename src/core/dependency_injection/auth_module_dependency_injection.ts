import UsersLocalDatasource from '../../data/datasources/users_datasource/users_local_datasource';
import IsUser from '../../presentation/api/auth_module/is_user';
import Login from '../../presentation/api/auth_module/login';
import Registration from '../../presentation/api/auth_module/registration';
import AuthModule from '../../presentation/types/modules/auth_module';
import ModuleDIParams from './module_di_params';

const authModuleDependencyInjection = ({
  sqlDatabase,
}: ModuleDIParams): AuthModule => {
  const usersDatasource = UsersLocalDatasource({ sqlDatabase });

  const login = Login({
    usersDatasource: usersDatasource,
  });

  const registration = Registration({
    usersDatasource: usersDatasource,
  });

  const isUser = IsUser({
    usersDatasource: usersDatasource,
  });

  return {
    login: login,
    registration: registration,
    isUser: isUser,
  };
};

export default authModuleDependencyInjection;

