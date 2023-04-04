import express from 'express';
import http from 'http';
import AuthModule from './core/dependency_injection/auth_module/auth_module';
import UserInvestmentAccountsModule from './core/dependency_injection/user_investment_accounts_module/user_investment_accounts_module';
import App from './app';

type Params = {
  url: string;
  port: number;
  api: AuthModule & UserInvestmentAccountsModule;
};

const AppImpl = ({ url, port, api }: Params): App => {
  const run = () => {
    const app = express();
    app.use(express.json());

    app.post('/registration', api.registration.handler);
    app.post('/login', api.login.handler);

    const investmentAccountsPath = '/investmentAccounts';
    app.get(investmentAccountsPath, api.getUserInvestmentAccounts.handler);
    app.post(investmentAccountsPath, api.createInvestmentAccount.handler);
    app.put(investmentAccountsPath, api.updateInvestmentAccount.handler);

    const server = http.createServer(app);
    server.listen(port, url, () => {
      console.log(`Success start server ${url}:${port}`);
    });
  };

  return {
    run,
  };
};

export default AppImpl;

