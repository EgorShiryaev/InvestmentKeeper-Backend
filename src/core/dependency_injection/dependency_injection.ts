import path from 'path';
import sqlDatabaseDependencyInjection from './sql_database_dependency_injection';
import authModuleDependencyInjection from './auth_module_dependency_injection';
import App from '../../app';
import investModuleDependencyInjection from './invest_module_dependency_injection';
import 'dotenv/config';
import OpenAPI from '@tinkoff/invest-openapi-js-sdk';

const localhost = '127.0.0.1';
const port = 9999;

const dependencyInjection = async () => {
  const dbPath = `../../../database/${process.env.ENV}.db`;
  const databasePath = path.resolve(__dirname, dbPath);

  const sqlDatabase = await sqlDatabaseDependencyInjection(databasePath);
  const apiURL = 'https://api-invest.tinkoff.ru/openapi';
  const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
  const secretToken = process.env.SANDBOX_TINKOFF_TOKEN;
  const tinkoffApi = new OpenAPI({
    apiURL: apiURL,
    socketURL: socketURL,
    secretToken: secretToken,
  });

  const authModule = authModuleDependencyInjection({
    sqlDatabase,
  });
  const investModule = investModuleDependencyInjection({
    sqlDatabase,
    remoteApi: tinkoffApi,
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

