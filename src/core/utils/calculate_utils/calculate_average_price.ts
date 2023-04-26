import currency from 'currency.js';

type CalcParams = {
  price: number;
  lots: number;
  newPrice: number;
  newLots: number;
};

const calculateAveragePrice = ({
  price,
  lots,
  newPrice,
  newLots,
}: CalcParams): number => {
  const totalLots = lots + newLots;
  const averagePrice =
    currency(price * lots).add(newPrice * newLots).value / totalLots;
  return averagePrice;
};

export default calculateAveragePrice;

