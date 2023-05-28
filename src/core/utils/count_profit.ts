import currency from 'currency.js';

export const countProfit = (currentPrice: number, purchasePrice: number) => {
  return currency(currentPrice - purchasePrice).value;
};

export const countProfitPercent = (profit: number, purchasePrice: number) => {
  if (profit === 0) {
    return 0;
  }
  return currency((profit / purchasePrice) * 100).value;
};
