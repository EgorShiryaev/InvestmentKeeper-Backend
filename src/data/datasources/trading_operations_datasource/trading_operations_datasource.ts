type CreateTradingOperationData = {
  investmentAssetId: number;
  lots: number;
  price: number;
  date?: string;
  commission?: number;
};

interface TradingOperationsDatasource {
  create: (data: CreateTradingOperationData) => Promise<number>;
}

export default TradingOperationsDatasource;

