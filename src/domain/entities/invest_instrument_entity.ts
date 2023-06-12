import BaseEntity from './base_entity';
import CurrencyEntity from './currency_entity';
import InvestInstrumentTypeEntity from './invest_instrument_type_entity';

type InvestInstrumentEntity = BaseEntity & {
  figi: string;
  ticker: string;
  title: string;
  lot: number;
  type: InvestInstrumentTypeEntity;
  currency: CurrencyEntity;
};

export default InvestInstrumentEntity;
