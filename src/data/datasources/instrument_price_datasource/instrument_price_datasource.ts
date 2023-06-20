import { InstrumentPriceEntity } from '../../../domain/repositories/instrument_price_repository_impl';

interface InstrumentPriceDatasource {
  getAll: (figis: string[]) => Promise<InstrumentPriceEntity[]>;
}

export default InstrumentPriceDatasource;

