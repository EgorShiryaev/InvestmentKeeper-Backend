import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import FinancialOperationsDatasource from './financial_operations_datasource';

const FinancialOperationsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): FinancialOperationsDatasource => {
  const table = TableTitle.financialOperations;
  
  return {
    create: ({ accountId, currencyId, value, date }) => {
      const dateValue = date ?? new Date().toISOString();
      const script = `INSERT INTO ${table} (accountId, currencyId, value, date)
        VALUES(${accountId}, ${currencyId}, ${value}, "${dateValue}")  
      `;
      return sqlDatabase.run(script).then((v) => v.lastId);
    },
  };
};

export default FinancialOperationsLocalDatasource;

