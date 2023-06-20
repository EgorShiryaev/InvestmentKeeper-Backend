import TableTitle from '../../databases/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import CurrencyDepositsDatasource from './currency_deposits_datasource';

const CurrencyDepositsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): CurrencyDepositsDatasource => {
  const table = TableTitle.currencyDeposits;

  return {
    getAllByAccountId: ({ accountId }) => {
      const currenciesTable = TableTitle.currencies;

      const script = `SELECT 
        ${table}.value_units, 
        ${table}.value_nano, 
        ${currenciesTable}.value AS "currency"
        FROM ${table}
        JOIN ${currenciesTable} On ${table}.currency_id = ${currenciesTable}.id
        WHERE account_id = ${accountId}`;

      return sqlDatabase.getAll(script);
    },
    getByAccountIdAndCurrencyId: ({ accountId, currencyId }) => {
      const script = `SELECT * FROM ${table}
        WHERE account_id = ${accountId} AND currency_id = ${currencyId}`;

      return sqlDatabase.get(script);
    },
    create: ({ accountId, currencyId }) => {
      const script = `INSERT INTO ${table} (account_id, currency_id)
        VALUES(${accountId}, ${currencyId})`;

      return sqlDatabase.create(script);
    },
    update: ({ id, value }) => {
      const script = `UPDATE ${table} SET value_units = ${value.units}, value_nano = ${value.nano} WHERE id = ${id}`;
      
      return sqlDatabase.update(script);
    },
  };
};

export default CurrencyDepositsLocalDatasource;

