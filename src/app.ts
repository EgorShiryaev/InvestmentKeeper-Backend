import express from 'express';
import http from 'http';
import AuthModule from './presentation/types/modules/auth_module';
import InvestModule from './presentation/types/modules/invest_module';
import { WebSocketServer } from 'ws';

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
        const apiVersion = '/api/v1';
        app.use(express.json());
        app.get(`${apiVersion}/isUser`, api.isUser.handler);
        app.post(`${apiVersion}/registration`, api.registration.handler);
        app.post(`${apiVersion}/login`, api.login.handler);
        const accountsPath = `${apiVersion}/accounts`;
        app.get(accountsPath, api.getAccounts.handler);
        app.post(accountsPath, api.createAccount.handler);
        app.put(accountsPath, api.updateAccount.handler);
        app.get(
          `${apiVersion}/searchInvestInstrument`,
          api.searchInvestInstrument.handler,
        );
        app.post(`${apiVersion}/sales`, api.createSale.handler);
        app.post(`${apiVersion}/purchases`, api.createPurchase.handler);
        app.post(`${apiVersion}/refills`, api.createRefill.handler);
        app.post(`${apiVersion}/withdrawals`, api.createWithdrawal.handler);

        app.get(`${apiVersion}/candles`, api.getCandles.handler);
        const server = http.createServer(app);
        server.listen(port, url, () => {
          console.log(`Success start server ${url}:${port}`);
        });
        const websocketServer = new WebSocketServer({
          server: server,
          path: `${apiVersion}/quotes`,
        });
        websocketServer.on('connection', api.getQuotes.connectionHandler);
        process.setMaxListeners(Infinity);
      } catch (error) {
        console.log('Run app error', error);
      }
    },
  };
};

export default App;

