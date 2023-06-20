import MoneyEntity from '../../../domain/entities/money_entity';

const isAGreaterB = (a: MoneyEntity, b: MoneyEntity): boolean => {
  return a.units > b.units || (a.units === b.units && a.nano > b.nano);
};

export default isAGreaterB;

