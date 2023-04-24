import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import SalesDatasource from './sales_datasource';

const SalesLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): SalesDatasource => {
  const table = TableTitle.sales;
  return {
    create: ({ accountItemId: accountId, lots, price }) => {
      const script = `INSERT INTO ${table} (accountItemId, lots, price)
        VALUES(${accountId}, ${lots}, ${price})  
      `;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
  };
};

export default SalesLocalDatasource;

