import InvestmentAssetFullModel from '../../../data/models/investment_asset_full_model';
import InvestmentAssetEntity from '../../../domain/entities/investment_asset_entity';
import convertToInvestInstrumentEntity from './convert_to_invest_instrument_entity';

const convertToInvestmentAssetEntity = (
  model: InvestmentAssetFullModel,
  currentPrice?: number,
): InvestmentAssetEntity => {
  return {
    id: model.investment_asset_id,
    lots: model.investment_asset_lots,
    averageExchangeRate: model.investment_asset_average_exchange_rate,
    averagePurchasePrice: model.investment_asset_average_purchase_price,
    currentPrice: currentPrice,
    instrument: convertToInvestInstrumentEntity(model),
  };
};

export default convertToInvestmentAssetEntity;

