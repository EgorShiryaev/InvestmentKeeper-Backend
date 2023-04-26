import QuotesDatasource from '../../../data/datasources/quotes_datasource/quotes_datasource';
import InstrumentPriceRepository from '../instrument_price_repository';
import InstrumentSubscribesRepository from './instrument_subscribes_repository';

const InstrumentSubscribesRepositoryImpl = (
  quotesDatasource: QuotesDatasource,
): InstrumentSubscribesRepository => {
  const storage = new Map<string, number | undefined>();
  const cancelStorage = new Map<string, (() => Promise<void>) | undefined>();

  const updatePrice = (figi: string, price: number) => {
    InstrumentPriceRepository.set(figi, price);
  };

  return {
    increment: (figi) => {
      const value = storage.get(figi);
      let newValue;
      if (value) {
        newValue = value + 1;
      } else {
        quotesDatasource
          .subscribeToPrice(figi, (price) => updatePrice(figi, price))
          .then((cancel) => cancelStorage.set(figi, cancel));
        newValue = 1;
      }
      storage.set(figi, newValue);
    },
    decrement: (figi) => {
      const value = storage.get(figi);
      let newValue;
      if (!value || value === 0) {
        return;
      } else if (value === 1) {
        const cancel = cancelStorage.get(figi);
        cancel && cancel().then(() => cancelStorage.set(figi, undefined));
        newValue = undefined;
      } else {
        newValue = value - 1;
      }
      storage.set(figi, newValue);
    },
  };
};

export default InstrumentSubscribesRepositoryImpl;

