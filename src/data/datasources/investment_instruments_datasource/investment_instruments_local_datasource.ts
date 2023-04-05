import InvestmentInstrumentType from '../../../domain/entities/investment_instrument/investment_instrument_type';
import { GetResult, RunResult } from '../../databases/types';
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
    create: ({ticker, title, numberInLot, aboutInstrument, type}) => {
      const script = `INSERT INTO ${tableTitle} (ticker, title, numberInLot, aboutInstrument, type) VALUES ("${ticker}", "${title}", ${numberInLot}, "${aboutInstrument}", "${type}" )`;

      return sqlDatabase.run(script);
    },
  };
};

export default InvestmentInstrumentsLocalDatasource;

