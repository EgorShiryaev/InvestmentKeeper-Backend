import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';

const divisionMoney = (money: MoneyEntity, n: number): MoneyEntity => {
  const unitsTemplate = money.units / n;
  const units = Math.floor(unitsTemplate);
  const nano = Math.ceil(
    (unitsTemplate - units) * NANO_VALUE + money.nano / n,
  );
  return { units, nano };
};

export default divisionMoney;
