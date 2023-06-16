import BaseModel from './base_model';

type InvestmentAssetModel = BaseModel & {
  account_id: number;
  instrument_id: number;
  lots: number;
  average_purchase_price: number;
  average_exchange_rate: number;
};

export default InvestmentAssetModel;

