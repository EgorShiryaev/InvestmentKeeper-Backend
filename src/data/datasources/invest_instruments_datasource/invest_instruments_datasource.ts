import InvestInstrumentFullModel from '../../models/invest_instrument_full_model';
import InvestInstrumentModel from '../../models/invest_instrument_model';

export type FigiRecord = {
  figi: string;
};

interface InvestInstrumentsDatasource {
  getAllLikeTitleOrTickerOrFigi: (
    value: string,
  ) => Promise<InvestInstrumentFullModel[]>;
  getById: (id: number) => Promise<InvestInstrumentModel | undefined>;
  getAllFigis: () => Promise<FigiRecord[]>;
}

export default InvestInstrumentsDatasource;

