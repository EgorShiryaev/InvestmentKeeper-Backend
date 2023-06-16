import SqlDatabase from '../../data/databases/sql_database';
import UsersLocalDatasource from '../../data/datasources/users_datasource/users_local_datasource';
import IsUserUsecaseImpl from '../../domain/usecases/is_user_usecase';
import LoginUsecaseImpl from '../../domain/usecases/login_usecase';
import RegistrationUsecaseImpl from '../../domain/usecases/registration_usecase';
import IsUser from '../../presentation/api/auth_module/is_user';
import Login from '../../presentation/api/auth_module/login';
import Registration from '../../presentation/api/auth_module/registration';
import AuthModule from '../../presentation/types/modules/auth_module';

type Params = {
  sqlDatabase: SqlDatabase;
};

const authModuleDependencyInjection = ({ sqlDatabase }: Params): AuthModule => {
  const usersDatasource = UsersLocalDatasource({ sqlDatabase });

  const isUserUsecase = IsUserUsecaseImpl({
    usersDatasource: usersDatasource,
  });
  const loginUsecase = LoginUsecaseImpl({
    usersDatasource: usersDatasource,
  });
  const registrationUsecase = RegistrationUsecaseImpl({
    usersDatasource: usersDatasource,
  });
  
  const isUser = IsUser({
    isUserUsecase: isUserUsecase,
  });
  const login = Login({
    loginUsecase: loginUsecase,
  });
  const registration = Registration({
    registrationUsecase: registrationUsecase,
  });

  return {
    login: login,
    registration: registration,
    isUser: isUser,
  };
};

export default authModuleDependencyInjection;

