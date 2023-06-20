import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';

type CalcParams = {
  price: MoneyEntity;
  lots: number;
};

const calculateTotalPrice = ({ price, lots }: CalcParams): MoneyEntity => {
  const nanoTemplate = price.nano * lots;
  const nano = nanoTemplate % NANO_VALUE;
  const units = price.units * lots + Math.floor(nanoTemplate / NANO_VALUE);

  return {
    units,
    nano,
  };
};

export default calculateTotalPrice;

