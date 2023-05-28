import BaseEntity from './base_entity';
import CurrencyEntity from './currency_entity';

type CurrencyDepositEntity = BaseEntity & {
  currency: CurrencyEntity;
  value: number;
};

export default CurrencyDepositEntity;

