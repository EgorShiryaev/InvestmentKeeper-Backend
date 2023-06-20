import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';

const aMinusB = (a: MoneyEntity, b: MoneyEntity): MoneyEntity => {
  const needAdditionalOne = b.nano > a.nano;
  const nano = a.nano - b.nano + (needAdditionalOne ? NANO_VALUE : 0);
  const units = a.units - b.units - (needAdditionalOne ? 1 : 0);

  return {
    nano,
    units,
  };
};

export default aMinusB;
