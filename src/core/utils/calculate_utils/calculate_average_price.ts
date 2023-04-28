import currency from 'currency.js';

type CalcParams = {
  averagePrice: number;
  lots: number;
  newPrice: number;
  newLots: number;
};

const calculateAveragePrice = ({
  averagePrice,
  lots,
  newPrice,
  newLots,
}: CalcParams): number => {
  const totalLots = lots + newLots;
  return (
    currency(averagePrice * lots).add(newPrice * newLots).value / totalLots
  );
};

export default calculateAveragePrice;

