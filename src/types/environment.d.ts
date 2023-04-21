export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_URL?: string;
      SERVER_PORT?: number;
      ENV: 'dev' | 'prod';
      SANDBOX_TINKOFF_TOKEN: string;
    }
  }
}

