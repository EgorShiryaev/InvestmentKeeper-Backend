interface SqlDatabase {
  get: <T>(sqlScript: string) => Promise<T | undefined>;
  getAll: <T>(sqlScript: string) => Promise<T[]>;
  create: (sqlScript: string) => Promise<number>;
  update: (sqlScript: string) => Promise<void>;
  createTable: (sqlScript: string) => Promise<void>;
}

export default SqlDatabase;

