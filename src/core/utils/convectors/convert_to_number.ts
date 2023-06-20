import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';

const convertToNumber = (value: MoneyEntity) => {
  return value.units + value.nano / NANO_VALUE;
};

export default convertToNumber;
