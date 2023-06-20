import BaseModel from './base_model';

type InvestmentAssetModel = BaseModel & {
  account_id: number;
  instrument_id: number;
  lots: number;
  average_purchase_price_units: number;
  average_purchase_price_nano: number;
  average_exchange_rate_units: number;
  average_exchange_rate_nano: number;
};

export default InvestmentAssetModel;

