import path from 'path';
import AppImpl from './app_impl';
import authModuleDependencyInjection from './core/dependency_injection/auth_module/auth_module_dependency_injection';
import sqlDatabaseDependencyInjection from './core/dependency_injection/sql_database/sql_database_dependency_injection';
import userInvestmentAccountsModuleDependencyInjection from './core/dependency_injection/user_investment_accounts_module/user_investment_accounts_module_dependency_injection';
import App from './app';

const dependencyInjection = async (): Promise<App> => {
  const dbPath = '../database/dev.db';
  const databasePath = path.resolve(__dirname, dbPath);

  const sqlDatabase = await sqlDatabaseDependencyInjection(databasePath);

  const authModule = authModuleDependencyInjection(sqlDatabase);
  const userInvestmentAccountsModule =
    userInvestmentAccountsModuleDependencyInjection(sqlDatabase);

  const app = AppImpl({
    url: '127.0.0.1',
    port: 9999,
    api: {
      ...authModule,
      ...userInvestmentAccountsModule,
    },
  });
  return app;
};

export default dependencyInjection;

