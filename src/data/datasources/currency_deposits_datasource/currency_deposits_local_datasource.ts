import TableTitle from '../../databases/types/table_title';
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
        ${table}.value AS "currencyDepositValue", 
        ${currenciesTable}.value AS "currencyDepositCurrency"
        FROM ${table}
        JOIN ${currenciesTable} On ${table}.currencyId = ${currenciesTable}.id
        WHERE accountId = ${accountId}`;

      return sqlDatabase.getAll(script);
    },
    getByAccountIdAndCurrencyId: ({ accountId, currencyId }) => {
      const script = `SELECT * FROM ${table}
        WHERE accountId = ${accountId} AND currencyId = ${currencyId}`;

      return sqlDatabase.get(script);
    },
    create: ({ accountId, currencyId, value }) => {
      const valueColumn = value ? ', value' : '';
      const valueValue = value ? `, ${value}` : '';
      const script = `INSERT INTO ${table} (accountId, currencyId ${valueColumn})
        VALUES(${accountId}, ${currencyId} ${valueValue})  
      `;
      return sqlDatabase.run(script).then((v) => v.lastId);
    },
    update: ({ id, value }) => {
      const script = `UPDATE ${table} SET value = ${value} WHERE id = ${id}`;
      return sqlDatabase.run(script).then((v) => v.changes);
    },
  };
};

export default CurrencyDepositsLocalDatasource;

