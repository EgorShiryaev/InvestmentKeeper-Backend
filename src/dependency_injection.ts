import path from 'path';
import AppImpl, { App } from './app';
import SqlDatabaseImpl from './data/databases/sql_database';
import UserLocalDatasource from './data/datasources/user_local_datasource';
import UserRepositoryImpl from './domain/repositories/user_repository_impl';
import RegistrationApi from './presentation/registration_api';

const dependencyInjection = async (): Promise<App> => {
  const databasePath = path.resolve(__dirname, '../database/dev.db');
  const sqlDatabase = SqlDatabaseImpl({
    databasePath: databasePath,
  });
  const userLocalDatasource = await UserLocalDatasource({
    sqlDatabase: sqlDatabase,
  });
  const userRepository = UserRepositoryImpl({
    localDatasource: userLocalDatasource,
  });
  const registrationApi = RegistrationApi({
    repository: userRepository,
  });

  const app = AppImpl({
    url: '127.0.0.1',
    port: 9999,
    api: {
      registration: registrationApi,
    },
  });
  return app;
};

export default dependencyInjection;

