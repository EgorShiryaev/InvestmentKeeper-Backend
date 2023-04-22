import BaseEntity from './base_entity';
import InvestInstrumentEntity from './invest_instrument_entity';

type AccountItemEntity = BaseEntity & {
  id: number;
  instrument: InvestInstrumentEntity;
  lots: number;
  averagePrice: number;
};

export default AccountItemEntity;
