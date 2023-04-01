import express from "express";
import https from "https";

type Params = {
  url: string;
  port: number;
};

const App = ({ url, port }: Params) => {
  const run = () => {
    const app = express();
    const server = https.createServer(app);
    server.listen(port, url, () => {
      console.log(`Success start server ${url}:${port}`);
    });
  };

  return {
    run,
  };
};

export default App;
