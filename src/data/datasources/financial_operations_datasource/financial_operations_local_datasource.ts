import TableTitle from '../../databases/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import FinancialOperationsDatasource from './financial_operations_datasource';

const FinancialOperationsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): FinancialOperationsDatasource => {
  const table = TableTitle.financialOperations;

  return {
    create: ({ accountId, currencyId, value, date }) => {
      const dateValue = date ?? new Date().toISOString();
      const script = `INSERT INTO ${table} (account_id, currency_id, value_units, value_nano, date)
        VALUES(${accountId}, ${currencyId}, ${value.units}, ${value.nano}, '${dateValue}')  
      `;
      return sqlDatabase.create(script);
    },
  };
};

export default FinancialOperationsLocalDatasource;

