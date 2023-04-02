import path from 'path';
import AppImpl, { App } from './app';
import createTables from './core/utils/create_tables';
import SqlDatabaseImpl from './data/databases/sql_database_impl';
import UserLocalDatasource from './data/datasources/user_datasource/user_local_datasource';
import UserInvestmentAccountsLocalDatasource from './data/datasources/user_investment_accounts_datasource/user_investment_accounts_local_datasource';
import UserInvestmentAccountsRepositoryImpl from './domain/repositories/user_investment_accounts_repository/user_investment_accounts_repository_impl';
import UserRepositoryImpl from './domain/repositories/user_repository/user_repository_impl';
import GetInvestmentAccountsApi from './presentation/apis/get_investment_accounts';
import LoginApi from './presentation/apis/login_api';
import RegistrationApi from './presentation/apis/registration_api';

const dependencyInjection = async (): Promise<App> => {
  const databasePath = path.resolve(__dirname, '../database/dev.db');
  const sqlDatabase = SqlDatabaseImpl({
    databasePath: databasePath,
  });

  await createTables(sqlDatabase);

  const userLocalDatasource = UserLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const userInvestmentAccountsDatasource =
    UserInvestmentAccountsLocalDatasource({
      sqlDatabase: sqlDatabase,
    });

  const userRepository = UserRepositoryImpl({
    localDatasource: userLocalDatasource,
  });
  const userInvestmentAccountsRepository = UserInvestmentAccountsRepositoryImpl(
    {
      userInvestmentAccountsDatasource: userInvestmentAccountsDatasource,
    },
  );

  const registrationApi = RegistrationApi({
    repository: userRepository,
  });
  const loginApi = LoginApi({
    repository: userRepository,
  });
  const getUserInvestmentAccounts = GetInvestmentAccountsApi({
    repository: userInvestmentAccountsRepository,
  });

  const app = AppImpl({
    url: '127.0.0.1',
    port: 9999,
    api: {
      registration: registrationApi,
      login: loginApi,
      getUserInvestmentAccounts: getUserInvestmentAccounts,
    },
  });
  return app;
};

export default dependencyInjection;

