import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';

const multiplyMoney = (money: MoneyEntity, n: number): MoneyEntity => {
  const nanoTemplate = money.nano * n;
  const nano = nanoTemplate % NANO_VALUE;
  const units = money.units * n + Math.floor(nanoTemplate / NANO_VALUE);
  return { units, nano };
};

export default multiplyMoney;