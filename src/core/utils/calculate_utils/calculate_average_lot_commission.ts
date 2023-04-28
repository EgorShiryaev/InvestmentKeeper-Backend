import currency from 'currency.js';

type CalcParams = {
  averageCommision: number;
  lots: number;
  newCommission?: number;
  newLots: number;
};

const calculateAverageLotCommission = ({
  averageCommision,
  lots,
  newCommission,
  newLots,
}: CalcParams): number => {
  const totalLots = lots + newLots;
  return (
    currency(averageCommision * lots).add((newCommission ??0))
      .value / totalLots
  );
};

export default calculateAverageLotCommission;

