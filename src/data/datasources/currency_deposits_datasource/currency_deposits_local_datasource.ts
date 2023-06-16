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
        ${table}.value AS "currency_deposit_value", 
        ${currenciesTable}.value AS "currency_deposit_currency"
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
    create: ({ accountId, currencyId, value }) => {
      const valueColumn = value ? ', value' : '';
      const valueValue = value ? `, ${value}` : '';
      const script = `INSERT INTO ${table} (account_id, currency_id ${valueColumn})
        VALUES(${accountId}, ${currencyId} ${valueValue})  
      `;
      return sqlDatabase.create(script);
    },
    update: ({ id, value }) => {
      const script = `UPDATE ${table} SET value = ${value} WHERE id = ${id}`;
      return sqlDatabase.update(script);
    },
  };
};

export default CurrencyDepositsLocalDatasource;

