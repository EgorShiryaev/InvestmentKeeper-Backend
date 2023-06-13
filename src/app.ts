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
        app.get(`${apiVersion}/isUser`, authApi.isUser.handler);
        app.post(`${apiVersion}/registration`, authApi.registration.handler);
        app.post(`${apiVersion}/login`, authApi.login.handler);
        const accountsPath = `${apiVersion}/accounts`;
        app.get(accountsPath, investApi.getAccounts.handler);
        app.post(accountsPath, investApi.createAccount.handler);
        app.put(accountsPath, investApi.updateAccount.handler);
        app.post(`${apiVersion}/sales`, investApi.createSale.handler);
        app.post(`${apiVersion}/purchases`, investApi.createPurchase.handler);
        app.post(`${apiVersion}/refills`, investApi.createRefill.handler);
        app.post(
          `${apiVersion}/withdrawals`,
          investApi.createWithdrawal.handler,
        );
        app.get(
          `${apiVersion}/searchInvestInstrument`,
          investApi.searchInvestInstrument.handler,
        );
        app.get(`${apiVersion}/candles`, investApi.getCandles.handler);
        // app.get(
        //   `${apiVersion}/instrumentPrice`,
        //   investApi.getInstrumentPrice.handler,
        // );
        // app.get(
        //   `${apiVersion}/accountPrice`,
        //   investApi.getAccountPrice.handler,
        // );
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

