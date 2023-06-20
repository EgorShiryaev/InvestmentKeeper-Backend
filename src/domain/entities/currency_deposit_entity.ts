import CurrencyEntity from './currency_entity';
import MoneyEntity from './money_entity';

type CurrencyDepositEntity = {
  currency: CurrencyEntity;
  value: MoneyEntity;
};

export default CurrencyDepositEntity;

