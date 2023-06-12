import InvestmentAssetFullModel from '../../../data/models/investment_asset_full_model';
import InvestmentAssetEntity from '../../../domain/entities/investment_asset_entity';
import convertToInvestInstrumentEntity from './convert_to_invest_instrument_entity';

const convertToInvestmentAssetEntity = (
  model: InvestmentAssetFullModel,
  currentPrice?: number,
): InvestmentAssetEntity => {
  return {
    id: model.investmentAssetId,
    lots: model.investmentAssetLots,
    averageExchangeRate: model.investmentAssetAverageExchangeRate,
    averagePurchasePrice: model.investmentAssetAveragePurchasePrice,
    currentPrice: currentPrice,
    instrument: convertToInvestInstrumentEntity(model),
  };
};

export default convertToInvestmentAssetEntity;

