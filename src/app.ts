import express from 'express';
import http from 'http';
import Api from './presentation/api';

type Params = {
  url: string;
  port: number;
  api: { registration: Api; login: Api };
};

export type App = {
  run: () => void;
};

const AppImpl = ({ url, port, api }: Params) => {
  const run = () => {
    const app = express();
    app.use(express.json());

    app.post('/registration', api.registration.handler);
    app.post('/login', api.login.handler);

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

