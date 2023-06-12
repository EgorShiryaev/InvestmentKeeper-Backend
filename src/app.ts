import express from 'express';
import http from 'http';
import AuthModule from './presentation/types/modules/auth_module';
import InvestModule from './presentation/types/modules/invest_module';

type Params = {
  url: string;
  port: number;
  authApi: AuthModule;
  investApi: InvestModule;
};

const App = ({ url, port, authApi, investApi }: Params) => {
  return {
    run: () => {
      try {
        const app = express();
        const apiVersion = '/api/v1';
        app.use(express.json());
        app.get('/isUser', authApi.isUser.handler);
        app.post('/registration', authApi.registration.handler);
        app.post('/login', authApi.login.handler);
        const accountsPath = '/accounts';
        app.get(accountsPath, investApi.getAccounts.handler);
        app.post(accountsPath, investApi.createAccount.handler);
        app.put(accountsPath, investApi.updateAccount.handler);
        app.post('/sales', investApi.createSale.handler);
        app.post('/purchases', investApi.createPurchase.handler);
        app.post('/refills', investApi.createRefill.handler);
        app.post('/withdrawals', investApi.createWithdrawal.handler);
        app.get(
          '/searchInvestInstrument',
          investApi.searchInvestInstrument.handler,
        );
        app.get('/candles', investApi.getCandles.handler);
        app.get('/instrumentPrice', investApi.getInstrumentPrice.handler);
        app.get('/accountPrice', investApi.getAccountPrice.handler);
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

