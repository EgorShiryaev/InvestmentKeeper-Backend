import BaseEntity from './base_entity';
import InvestInstrumentEntity from './invest_instrument_entity';

type AccountItemEntity = BaseEntity & {
  id: number;
  instrument: InvestInstrumentEntity;
  lots: number;
  averagePurchasePrice: number;
  currentPrice?: number;
};

export default AccountItemEntity;

