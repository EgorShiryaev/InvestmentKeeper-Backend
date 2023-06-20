import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';

const aPlusB = (a: MoneyEntity, b: MoneyEntity): MoneyEntity => {
  const nanoTemplate = a.nano + b.nano;
  const nano = nanoTemplate % NANO_VALUE;
  const units = a.units + b.units + Math.floor(nanoTemplate / NANO_VALUE);

  return {
    nano,
    units,
  };
};

export default aPlusB;

