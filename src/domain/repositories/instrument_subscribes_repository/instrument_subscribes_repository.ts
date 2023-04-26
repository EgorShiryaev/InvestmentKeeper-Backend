interface InstrumentSubscribesRepository {
  increment: (figi: string) => void;
  decrement: (figi: string) => void;
}

export default InstrumentSubscribesRepository;

