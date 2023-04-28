import currency from 'currency.js';

type CalcParams = {
  currencyBalance: number;
  price: number;
  lots: number;
  isAddition: boolean;
  commission?: number;
};

const calculateCurrencyBalance = ({
  currencyBalance,
  price,
  lots,
  isAddition,
  commission,
}: CalcParams): number => {
  return currency(
    currencyBalance + (isAddition ? +price : -price) * lots - (commission ?? 0),
  ).value;
};

export default calculateCurrencyBalance;

