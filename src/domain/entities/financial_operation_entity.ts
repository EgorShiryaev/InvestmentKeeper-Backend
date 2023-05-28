import BaseEntity from './base_entity';
import CurrencyEntity from './currency_entity';

type FinancialOperationEntity = BaseEntity & {
  currency: CurrencyEntity;
  date: string;
  value: number;
};

export default FinancialOperationEntity;

