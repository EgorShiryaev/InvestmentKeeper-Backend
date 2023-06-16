export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: number;
      SANDBOX_TINKOFF_TOKEN: string;
      DB_USER: string;
      DB_HOST: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      DB_PORT: number;
    }
  }
}

