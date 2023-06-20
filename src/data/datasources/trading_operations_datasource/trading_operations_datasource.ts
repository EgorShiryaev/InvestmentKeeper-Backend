import MoneyEntity from '../../../domain/entities/money_entity';

type CreateTradingOperationData = {
  investmentAssetId: number;
  lots: number;
  price: MoneyEntity;
  date?: string;
  commission?: MoneyEntity;
};

interface TradingOperationsDatasource {
  create: (data: CreateTradingOperationData) => Promise<number>;
}

export default TradingOperationsDatasource;

