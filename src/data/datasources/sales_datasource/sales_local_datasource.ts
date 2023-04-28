import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import SalesDatasource from './sales_datasource';

const SalesLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): SalesDatasource => {
  const table = TableTitle.sales;
  return {
    create: ({ accountItemId: accountId, lots, price, date, commission }) => {
      const dateValue = date ?? new Date().toISOString();
      const commissionColumn = commission ? ', commission' : '';
      const commissionValue = commission ? `, ${commission}` : '';

      const script = `INSERT INTO ${table} (accountItemId, lots, price, date ${commissionColumn})
        VALUES(${accountId}, ${lots}, ${price}, "${dateValue}" ${commissionValue})  
      `;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
  };
};

export default SalesLocalDatasource;

