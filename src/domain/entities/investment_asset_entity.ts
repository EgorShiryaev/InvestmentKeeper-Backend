import BaseEntity from './base_entity';
import InvestInstrumentEntity from './invest_instrument_entity';

type InvestmentAssetEntity = BaseEntity & {
  instrument: InvestInstrumentEntity;
  lots: number;
  averagePurchasePrice: number;
  averageExchangeRate: number;
  currentPrice?: number;
  totalLots: number;
  totalCurrentPrice?: number;
  profit?: number;
  profitPercent?: number;
};

export default InvestmentAssetEntity;

