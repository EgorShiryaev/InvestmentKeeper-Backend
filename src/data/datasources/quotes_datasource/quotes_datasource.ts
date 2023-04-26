type CancelCallback = () => Promise<void>;

interface QuotesDatasource {
  subscribeToPrice: (
    figi: string,
    onNewPrice: (newPrice: number) => void,
  ) => Promise<CancelCallback>;
}

export default QuotesDatasource;

