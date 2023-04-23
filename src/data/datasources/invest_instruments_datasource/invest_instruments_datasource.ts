import InvestInstrumentFullModel from '../../models/invest_instrument_full_model';

interface InvestInstrumentsDatasource {
  getAllLikeTitleOrTickerOrFigi: (
    value: string,
  ) => Promise<InvestInstrumentFullModel[]>;
}

export default InvestInstrumentsDatasource;

