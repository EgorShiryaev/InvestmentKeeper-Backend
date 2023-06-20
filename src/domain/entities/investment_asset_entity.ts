import BaseEntity from './base_entity';
import InvestInstrumentEntity from './invest_instrument_entity';
import MoneyEntity from './money_entity';

type InvestmentAssetEntity = BaseEntity & {
  instrument: InvestInstrumentEntity;
  lots: number;
  averagePurchasePrice: MoneyEntity;
  averageExchangeRate: MoneyEntity;
  currentPrice?: MoneyEntity;
};

export default InvestmentAssetEntity;

