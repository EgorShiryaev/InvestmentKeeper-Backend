import path from 'path';
import AppImpl from './app_impl';
import authModuleDependencyInjection from './core/dependency_injection/auth_module/auth_module_dependency_injection';
import sqlDatabaseDependencyInjection from './core/dependency_injection/sql_database/sql_database_dependency_injection';
import investmentAccountsModuleDependencyInjection from './core/dependency_injection/investment_accounts_module/investment_accounts_module_dependency_injection';
import App from './app';
import 'dotenv/config';

const localhost = '127.0.0.1';
const port = 9999;

const dependencyInjection = async (): Promise<App> => {
  const dbPath = `../database/${process.env.ENV}.db`;
  const databasePath = path.resolve(__dirname, dbPath);

  const sqlDatabase = await sqlDatabaseDependencyInjection(databasePath);

  const authModule = authModuleDependencyInjection(sqlDatabase);
  const userInvestmentAccountsModule =
    investmentAccountsModuleDependencyInjection(sqlDatabase);

  const app = AppImpl({
    url: process.env.SERVER_URL || localhost,
    port: process.env.SERVER_PORT || port,
    api: {
      ...authModule,
      ...userInvestmentAccountsModule,
    },
  });
  return app;
};

export default dependencyInjection;

