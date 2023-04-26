interface InstrumentPriceDatasource {
  get: (figi: string) => Promise<number | undefined>;
}

export default InstrumentPriceDatasource;

