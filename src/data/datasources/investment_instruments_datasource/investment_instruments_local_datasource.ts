import TableTitle from '../../databases/types/table_title';
import DatasourceParameters from '../datasource_parameters';
import InvestmentInstrumentsDatasource from './investment_instruments_datasource';

const InvestmentInstrumentsLocalDatasource = ({
  sqlDatabase,
}: DatasourceParameters): InvestmentInstrumentsDatasource => {
  const tableTitle = TableTitle.investmentInstruments;

  return {
    getWhereId: (id) => {
      const script = `SELECT * FROM ${tableTitle} 
      WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
    create: (data) => {
      const script = `INSERT INTO ${tableTitle} (figi, ticker, title, numberInLot, aboutInstrument, type, currency) VALUES ("${data.figi}","${data.ticker}", "${data.title}", ${data.numberInLot}, "${data.aboutInstrument}", "${data.type}", "${data.currency}")`;

      return sqlDatabase.run(script);
    },
  };
};

export default InvestmentInstrumentsLocalDatasource;

