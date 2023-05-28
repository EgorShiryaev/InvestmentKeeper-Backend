import currency from 'currency.js';
import AccountModel from '../../../data/models/account_model';
import AccountEntity from '../../../domain/entities/account_entity';
import InvestmentAssetEntity from '../../../domain/entities/investment_asset_entity';
import CurrencyDepositEntity from '../../../domain/entities/currency_deposit_entity';
import { countProfit, countProfitPercent } from '../count_profit';

type Price = {
  purchase: number;
  current: number;
};

const convertToAccountEntity = (
  model: AccountModel,
  items: InvestmentAssetEntity[],
  currencyDeposits: CurrencyDepositEntity[],
): AccountEntity => {
  const accountPrice: Price = items.reduce(
    (prev, current) => {
      const lots = current.lots * current.instrument.lot;
      const purchasePrice = currency(current.averagePurchasePrice * lots).value;
      const currentPrice = currency((current.currentPrice ?? 0) * lots).value;

      return {
        purchase: currency(prev.purchase + purchasePrice).value,
        current: currency(prev.current + currentPrice).value,
      };
    },
    {
      purchase: 0,
      current: 0,
    },
  );

  const profit = countProfit(accountPrice.current, accountPrice.purchase);
  const profitPercent = countProfitPercent(profit, accountPrice.purchase);

  return {
    id: model.id,
    title: model.title,
    purchasePrice: accountPrice.purchase,
    currentPrice: accountPrice.current,
    profit: profit,
    profitPercent: profitPercent,
    items: items,
    currencyDeposits: currencyDeposits,
  };
};

export default convertToAccountEntity;

