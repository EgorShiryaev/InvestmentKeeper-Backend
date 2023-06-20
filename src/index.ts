import dependencyInjection from './core/dependency_injection/dependency_injection';
import calculateAveragePrice from './core/utils/calculate_utils/calculate_average_price';
import { SqlDatabaseImplParams } from './data/databases/sql_database_impl';

const secretToken = process.env.SANDBOX_TINKOFF_TOKEN;
const postgresParams: SqlDatabaseImplParams = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  databaseName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
};

dependencyInjection({
  tinkoffSecretToken: secretToken,
  sqlDatabaseParams: postgresParams,
})
  .then((app) => app.run())
  .catch((e) => console.log(e));
