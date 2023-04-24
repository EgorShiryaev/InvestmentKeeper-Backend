import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import PurchasesDatasource from './purchases_datasource';

const SalesLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): PurchasesDatasource => {
  const table = TableTitle.purchases;
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

