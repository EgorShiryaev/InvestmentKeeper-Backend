import TableTitle from '../../databases/types/table_title';
import DatasourceParameters from '../datasource_parameters';
import InvestmentAccountItemsDatasource from './investment_account_items_datasource';

const InvestmentAccountItemsLocalDatasource = ({
  sqlDatabase,
}: DatasourceParameters): InvestmentAccountItemsDatasource => {
  const tableTitle = TableTitle.investmentAccountItems;

  return {
    getAll: (accountId) => {
      const script = `SELECT instrumentId, lotsNumber, lotAveragePrice 
      FROM ${tableTitle} 
      WHERE accountId = ${accountId}`;

      return sqlDatabase.getAll(script);
    },
    getWhereId: (id) => {
      const script = `SELECT instrumentId, lotsNumber, lotAveragePrice 
      FROM ${tableTitle} 
      WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
    create: ({ accountId, instrumentId, lotsNumber, lotAveragePrice }) => {
      const script = `INSERT INTO ${tableTitle} (accountId, instrumentId, lotsNumber, lotAveragePrice) 
      VALUES (${accountId}, ${instrumentId}, ${lotsNumber}, ${lotAveragePrice})`;

      return sqlDatabase.run(script);
    },
    update: ({ id, lotsNumber, lotAveragePrice }) => {
      const script = `UPDATE ${tableTitle} SET lotsNumber = ${lotsNumber}, lotAveragePrice = ${lotAveragePrice}  WHERE id = ${id}`;
      return sqlDatabase.run(script);
    },
    delete: (id) => {
      const script = `DELETE FROM ${tableTitle} WHERE id = ${id}`;
      return sqlDatabase.run(script);
    },
  };
};

export default InvestmentAccountItemsLocalDatasource;

