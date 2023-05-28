import BaseEntity from './base_entity';
import InvestInstrumentEntity from './invest_instrument_entity';

type TradingOperationEntity = BaseEntity & {
  date: string;
  lots: number;
  price: number;
  commission: number;
  instrument: InvestInstrumentEntity;
};

export default TradingOperationEntity;

