import App from "./app";
import SqlDatabase from "./databases/sql_database";
import UserLocalDatasource from "./datasources/user_local_datasource";
import UserRepositoryImpl from "./repositories/user_repository_impl";

const dependencyInjection = () => {
  const databasePath = "../../database/dev.db";
  const sqlDatabase = SqlDatabase({ databasePath: databasePath });
  const userLocalDatasource = UserLocalDatasource({ sqlDatabase: sqlDatabase });
  const userRepository = UserRepositoryImpl({
    localDatasource: userLocalDatasource,
  });

  const app = App({
    url: "127.0.0.1",
    port: 9999,
  });

  return app;
};

export default dependencyInjection;
