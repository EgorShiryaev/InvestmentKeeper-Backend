import path from 'path';
import sqlDatabaseDependencyInjection from './sql_database_dependency_injection';
import authModuleDependencyInjection from './auth_module_dependency_injection';
import App from '../../app';
import investModuleDependencyInjection from './invest_module_dependency_injection';
import 'dotenv/config';
import { TinkoffInvestApi } from 'tinkoff-invest-api';

const localhost = '127.0.0.1';
const port = 9999;

const dependencyInjection = async () => {
  const dbPath = `../../../database/${process.env.ENV}.db`;
  const databasePath = path.resolve(__dirname, dbPath);

  const sqlDatabase = await sqlDatabaseDependencyInjection(databasePath);
  const secretToken = process.env.SANDBOX_TINKOFF_TOKEN;
  const tinkoffApi = new TinkoffInvestApi({
    token: secretToken,
  });

  const authModule = authModuleDependencyInjection({
    sqlDatabase,
  });
  const investModule = investModuleDependencyInjection({
    sqlDatabase,
    api: tinkoffApi,
  });

  const app = App({
    url: process.env.SERVER_URL || localhost,
    port: process.env.SERVER_PORT || port,
    api: {
      ...authModule,
      ...investModule,
    },
  });
  return app;
};

export default dependencyInjection;

