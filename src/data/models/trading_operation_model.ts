import BaseModel from './base_model';

type TradingOperationModel = BaseModel & {
  investmentAssetId: number;
  date: string;
  lots: number;
  price: number;
  commission: number;
};

export default TradingOperationModel;

