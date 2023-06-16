import InvestInstrumentFullModel from './invest_instrument_full_model';

type InvestmentAssetFullModel = {
  investment_asset_id: number;
  investment_asset_lots: number;
  investment_asset_average_purchase_price: number;
  investment_asset_average_exchange_rate: number;
} & InvestInstrumentFullModel;

export default InvestmentAssetFullModel;

