import currency from 'currency.js';

type CalcParams = {
  balance: number;
  price: number;
  lots: number;
  commission?: number;
};

const calculateBalance = ({
  balance,
  price,
  lots,
  commission,
}: CalcParams): number => {
  const totalPrice = price * lots;
  return currency(balance + totalPrice - (commission ?? 0)).value;
};

export default calculateBalance;

