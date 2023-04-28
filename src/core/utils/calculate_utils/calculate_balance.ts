import currency from 'currency.js';

type CalcParams = {
  balance: number;
  price: number;
  lots: number;
  isAddition: boolean;
  commission?: number;
};

const calculateBalance = ({
  balance,
  price,
  lots,
  isAddition,
  commission,
}: CalcParams): number => {
  return currency(
    balance + (isAddition ? +price : -price) * lots - (commission ?? 0),
  ).value;
};

export default calculateBalance;

