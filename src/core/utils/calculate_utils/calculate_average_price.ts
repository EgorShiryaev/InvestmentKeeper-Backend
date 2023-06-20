import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';
import aPlusB from '../money_utils/a_plus_b';
import divisionMoney from '../money_utils/division_money';
import multiplyMoney from '../money_utils/multiply_money';

type CalcParams = {
  averagePrice: MoneyEntity;
  lots: number;
  newPrice: MoneyEntity;
  newLots: number;
};

const calculateAveragePrice = ({
  averagePrice,
  lots,
  newPrice,
  newLots,
}: CalcParams): MoneyEntity => {
  const totalLots = lots + newLots;
  const currentTotalPrice = multiplyMoney(averagePrice, lots);
  const newTotalPrice = multiplyMoney(newPrice, newLots);
  const newAverageTotalPrice = aPlusB(currentTotalPrice, newTotalPrice);
  const result = divisionMoney(newAverageTotalPrice, totalLots);
  return result;
};

export default calculateAveragePrice;

