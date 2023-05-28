import CurrencyDepositFullModel from '../../../data/models/currency_deposit_full_model';
import CurrencyDepositEntity from '../../../domain/entities/currency_deposit_entity';
import convertToCurrencyEntity from './convert_to_currency_entity';

const convertToCurrencyDepositEntity = (
  model: CurrencyDepositFullModel,
): CurrencyDepositEntity => {
  return {
    id: model.id,
    value: model.currencyDepositValue,
    currency: convertToCurrencyEntity(model.currencyDepositCurrency),
  };
};

export default convertToCurrencyDepositEntity;

