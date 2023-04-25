import express from 'express';
import http from 'http';
import AuthModule from './presentation/types/modules/auth_module';
import InvestModule from './presentation/types/modules/invest_module';

type Params = {
  url: string;
  port: number;
  api: AuthModule & InvestModule;
};

const App = ({ url, port, api }: Params) => {
  return {
    run: () => {
      try {
        const app = express();
        app.use(express.json());
        app.get('/isUser', api.isUser.handler);
        app.post('/registration', api.registration.handler);
        app.post('/login', api.login.handler);
        const accountsPath = '/accounts';
        app.get(accountsPath, api.getAccounts.handler);
        app.post(accountsPath, api.createAccount.handler);
        app.put(accountsPath, api.updateAccount.handler);
        app.put('/accountVisibility', api.changeVisibilityAccount.handler);
        app.get('/searchInvestInstrument', api.searchInvestInstrument.handler);
        app.post('/sales', api.createSale.handler);
        app.post('/purchases', api.createPurchase.handler);
        app.post('/refills', api.createRefill.handler);
        app.post('/withdrawals', api.createWithdrawal.handler);
        app.get('/instrumentComments', api.getComment.handler);

        const server = http.createServer(app);
        server.listen(port, url, () => {
          console.log(`Success start server ${url}:${port}`);
        });
      } catch (error) {
        console.log('Run app error', error);
      }
    },
  };
};

export default App;

