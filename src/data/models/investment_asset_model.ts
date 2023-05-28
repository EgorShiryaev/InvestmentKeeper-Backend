import BaseModel from './base_model';

type InvestmentAssetModel = BaseModel & {
  accountId: number;
  instrumentId: number;
  lots: number;
  averagePurchasePrice: number;
  averageExchangeRate: number;
};

export default InvestmentAssetModel;

