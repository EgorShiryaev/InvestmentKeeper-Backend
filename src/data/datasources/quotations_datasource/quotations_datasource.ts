import { InstrumentPriceEntity } from '../../../domain/repositories/instrument_price_repository_impl';

type InstrumentParams = {
  figi: string;
};

interface QuotationsDatasource {
  getAll: (
    instruments: InstrumentParams[],
    handler: (lastPrice: InstrumentPriceEntity) => void,
  ) => void;
}

export default QuotationsDatasource;

