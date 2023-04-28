import currency from 'currency.js';

type CalcParams = {
  balance: number;
  price: number;
  lots: number;
  isAddition: boolean;
  commision?: number;
};

const calculateBalance = ({
  balance,
  price,
  lots,
  isAddition,
  commision,
}: CalcParams): number => {
  return currency(
    balance + (isAddition ? +price : -price) * lots - (commision ?? 0),
  ).value;
};

export default calculateBalance;

