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
      const commissionUnitsColumn = commission ? ', commission_units' : '';
      const commissionUnitsValue = commission ? `, ${commission.units}` : '';
      const commissionNanoColumn = commission ? ', commission_nano' : '';
      const commissionNanoValue = commission ? `, ${commission.nano}` : '';

      const script = `INSERT INTO ${table} (investment_asset_id, lots, price_units, price_nano, date ${commissionUnitsColumn} ${commissionNanoColumn})
        VALUES(${investmentAssetId}, ${lots}, ${price.units}, ${price.nano}, '${dateValue}' ${commissionUnitsValue} ${commissionNanoValue})  
      `;

      return sqlDatabase.create(script);
    },
  };
};

export default TradingOperationsLocalDatasource;

