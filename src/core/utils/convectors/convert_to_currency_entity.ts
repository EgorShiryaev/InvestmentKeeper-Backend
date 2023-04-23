import CurrencyEntity from '../../../domain/entities/currency_entity';

const convertToCurrencyEntity = (currency: string): CurrencyEntity => {
  switch (currency) {
  case 'RUB':
    return CurrencyEntity.rub;
  }
  return CurrencyEntity.rub;
};

export default convertToCurrencyEntity;

