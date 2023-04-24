import currency from 'currency.js';

type CalcParams = {
  balance: number;
  price: number;
  lots: number;
  isAddition: boolean;
};

const calculateBalance = ({
  balance,
  price,
  lots,
  isAddition,
}: CalcParams): number => {
  return currency(balance + (isAddition ? +price : -price) * lots).value;
};

export default calculateBalance;

