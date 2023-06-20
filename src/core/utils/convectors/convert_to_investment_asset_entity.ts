import InvestmentAssetFullModel from '../../../data/models/investment_asset_full_model';
import InvestmentAssetEntity from '../../../domain/entities/investment_asset_entity';
import MoneyEntity from '../../../domain/entities/money_entity';
import convertToInvestInstrumentEntity from './convert_to_invest_instrument_entity';

const convertToInvestmentAssetEntity = (
  model: InvestmentAssetFullModel,
  currentPrice?: MoneyEntity,
): InvestmentAssetEntity => {
  return {
    id: model.investment_asset_id,
    lots: model.investment_asset_lots,
    averageExchangeRate: {
      units: model.investment_asset_average_exchange_rate_units,
      nano: model.investment_asset_average_exchange_rate_nano,
    },
    averagePurchasePrice: {
      units: model.investment_asset_average_purchase_price_units,
      nano: model.investment_asset_average_purchase_price_nano,
    },
    currentPrice: currentPrice,
    instrument: convertToInvestInstrumentEntity(model),
  };
};

export default convertToInvestmentAssetEntity;

