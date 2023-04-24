import currency from 'currency.js';

type CalcParams = {
  price: number;
  lots: number;
};

const calculateTotalPrice = ({ price, lots }: CalcParams): number => {
  return currency(price * lots).value;
};

export default calculateTotalPrice;

