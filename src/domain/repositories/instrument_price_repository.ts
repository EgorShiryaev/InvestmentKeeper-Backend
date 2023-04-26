const storage = new Map<string, number>();

const set = (figi: string, price: number) => {
  storage.set(figi, price);
};

const get = (figi: string) => {
  return storage.get(figi);
};

const InstrumentPriceRepository = {
  set: set,
  get: get,
};

export default InstrumentPriceRepository;

