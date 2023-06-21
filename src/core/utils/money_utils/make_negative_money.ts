import MoneyEntity from '../../../domain/entities/money_entity';

const makeNegativeMoney = (price: MoneyEntity) : MoneyEntity=> {
  return {
    nano: -price.nano,
    units: -price.units
  };
};

export default makeNegativeMoney;