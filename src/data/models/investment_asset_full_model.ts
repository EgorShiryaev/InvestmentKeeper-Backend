import InvestInstrumentFullModel from './invest_instrument_full_model';

type InvestmentAssetFullModel = {
  investmentAssetId: number;
  investmentAssetLots: number;
  investmentAssetAveragePurchasePrice: number;
  investmentAssetAverageExchangeRate: number;
} & InvestInstrumentFullModel;

export default InvestmentAssetFullModel;

