import InvestInstrumentFullModel from '../../models/invest_instrument_full_model';
import InvestInstrumentModel from '../../models/invest_instrument_model';

interface InvestInstrumentsDatasource {
  getAllLikeTitleOrTickerOrFigi: (
    value: string,
  ) => Promise<InvestInstrumentFullModel[]>;
  getById: (id: number) => Promise<InvestInstrumentModel | undefined>;
}

export default InvestInstrumentsDatasource;

