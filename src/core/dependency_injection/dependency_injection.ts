import sqlDatabaseDependencyInjection from './sql_database_dependency_injection';
import authModuleDependencyInjection from './auth_module_dependency_injection';
import App from '../../app';
import investModuleDependencyInjection from './invest_module_dependency_injection';
import 'dotenv/config';
import { TinkoffInvestApi } from 'tinkoff-invest-api';
import { SqlDatabaseImplParams } from '../../data/databases/sql_database_impl';

const port = 80;

type Params = {
  tinkoffSecretToken: string;
  sqlDatabaseParams: SqlDatabaseImplParams;
};

const dependencyInjection = async ({
  tinkoffSecretToken,
  sqlDatabaseParams,
}: Params) => {
  const sqlDatabase = await sqlDatabaseDependencyInjection(sqlDatabaseParams);

  const tinkoffApi = new TinkoffInvestApi({
    token: tinkoffSecretToken,
  });

  const authModule = authModuleDependencyInjection({
    sqlDatabase,
  });
  const investModule = await investModuleDependencyInjection({
    sqlDatabase,
    api: tinkoffApi,
  });

  const app = App({
    port: process.env.PORT || port,
    authApi: authModule,
    investApi: investModule,
  });
  return app;
};

export default dependencyInjection;

