import InstrumentPriceDatasource from '../../data/datasources/instrument_price_datasource/instrument_price_datasource';
import InvestInstrumentsDatasource, {
  FigiRecord,
} from '../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import QuotationsDatasource from '../../data/datasources/quotations_datasource/quotations_datasource';
import MoneyEntity from '../entities/money_entity';

type Params = {
  instrumentsDatasource: InvestInstrumentsDatasource;
  instrumentPriceDatasource: InstrumentPriceDatasource;
  quotationsDatasource: QuotationsDatasource;
};

export type InstrumentPriceEntity = {
  figi: string;
  price?: MoneyEntity;
};

export type InstrumentPriceRepository = {
  init: () => Promise<void>;
  get: (key: string) => MoneyEntity | undefined;
};

const InstrumentPriceRepositoryImpl = ({
  instrumentsDatasource,
  instrumentPriceDatasource,
  quotationsDatasource,
}: Params) => {
  const storage = new Map<string, MoneyEntity>();

  const set = (instrument: InstrumentPriceEntity) => {
    if (instrument.price) {
      storage.set(instrument.figi, instrument.price);
    } else {
      console.log('not found price', instrument.figi);
    }
  };

  const init = async () => {
    try {
      const records = await instrumentsDatasource.getAllFigis();
      const figis = records.map((v) => v.figi);
      console.log('figis', figis.length);
      const instrumentsPrices = await instrumentPriceDatasource.getAll(figis);
      console.log('instrumentsPrices', instrumentsPrices.length);
      for (const instrument of instrumentsPrices) {
        set(instrument);
      }
      startQuotationsSocket(records);
    } catch (e) {
      console.log('init error', e);
    }
  };

  const startQuotationsSocket = (records: FigiRecord[]) => {
    quotationsDatasource.getAll(records, set);
  };

  const get = (figi: string): MoneyEntity | undefined => {
    return storage.get(figi);
  };

  return {
    init,
    get,
  };
};

export default InstrumentPriceRepositoryImpl;

