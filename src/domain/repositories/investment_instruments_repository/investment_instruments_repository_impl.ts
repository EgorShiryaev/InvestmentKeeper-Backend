import InvestmentInstrumentsDatasource from '../../../data/datasources/investment_instruments_datasource/investment_instruments_datasource';
import InvestmentInstrumentsRepository from './investment_instruments_repository';

type Params = {
  localDatasource: InvestmentInstrumentsDatasource;
};
const InvestmentInstrumentsRepositoryImpl = ({
  localDatasource,
}: Params): InvestmentInstrumentsRepository => {
  return {
    getWhereId: (id) => {
      return localDatasource.getWhereId(id);
    },
  };
};

export default InvestmentInstrumentsRepositoryImpl;

