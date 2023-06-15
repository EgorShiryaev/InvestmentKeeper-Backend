import TableTitle from '../../databases/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import TradingOperationsDatasource from './trading_operations_datasource';

const TradingOperationsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): TradingOperationsDatasource => {
  const table = TableTitle.tradingOperations;
  return {
    create: ({ investmentAssetId, lots, price, date, commission }) => {
      const dateValue = date ?? new Date().toISOString();
      const commissionColumn = commission ? ', commission' : '';
      const commissionValue = commission ? `, ${commission}` : '';

      const script = `INSERT INTO ${table} (investment_asset_id, lots, price, date ${commissionColumn})
        VALUES(${investmentAssetId}, ${lots}, ${price}, '${dateValue}' ${commissionValue})  
      `;

      return sqlDatabase.create(script);
    },
  };
};

export default TradingOperationsLocalDatasource;

