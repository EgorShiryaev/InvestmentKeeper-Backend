import InvestmentAssetFullModel from '../../../data/models/investment_asset_full_model';
import InvestmentAssetEntity from '../../../domain/entities/investment_asset_entity';
import { countProfit, countProfitPercent } from '../count_profit';
import convertToInvestInstrumentEntity from './convert_to_invest_instrument_entity';

const convertToInvestmentAssetEntity = (
  model: InvestmentAssetFullModel,
  currentPrice?: number,
): InvestmentAssetEntity => {
  const totalLots = model.investmentAssetLots * model.instrumentLot;
  const totalCurrentPrice = currentPrice && currentPrice * totalLots;
  const totalPurchasePrice =
    model.investmentAssetAveragePurchasePrice * totalLots;
  const profit =
    totalCurrentPrice && countProfit(totalCurrentPrice, totalPurchasePrice);
  const profitPercent =
    profit && countProfitPercent(profit, totalPurchasePrice);
  return {
    id: model.investmentAssetId,
    lots: model.investmentAssetLots,
    averageExchangeRate: model.investmentAssetAverageExchangeRate,
    averagePurchasePrice: model.investmentAssetAveragePurchasePrice,
    currentPrice: currentPrice,
    instrument: convertToInvestInstrumentEntity(model),
    totalLots: totalLots,
    totalCurrentPrice: totalCurrentPrice,
    profit: profit,
    profitPercent: profitPercent,
  };
};

export default convertToInvestmentAssetEntity;

