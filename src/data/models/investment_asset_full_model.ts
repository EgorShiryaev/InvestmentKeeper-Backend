import InvestInstrumentFullModel from './invest_instrument_full_model';

type InvestmentAssetFullModel = {
  investment_asset_id: number;
  investment_asset_lots: number;
  investment_asset_average_purchase_price_units: number;
  investment_asset_average_purchase_price_nano: number;
  investment_asset_average_exchange_rate_units: number;
  investment_asset_average_exchange_rate_nano: number;
} & InvestInstrumentFullModel;

export default InvestmentAssetFullModel;

