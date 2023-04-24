import BaseEntity from './base_entity';
import InvestInstrumentEntity from './invest_instrument_entity';

type PurchaseEntity = BaseEntity & {
  date: string;
  lots: number;
  price: number;
  instrument: InvestInstrumentEntity;
};

export default PurchaseEntity;

