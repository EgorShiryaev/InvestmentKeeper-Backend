import currency from 'currency.js';
import AccountModel from '../../../data/models/account_model';
import AccountEntity from '../../../domain/entities/account_entity';
import AccountItemEntity from '../../../domain/entities/account_item_entity';

type Price = {
  purchase: number;
  current: number;
};

const convertToAccountEntity = (
  model: AccountModel,
  items: AccountItemEntity[],
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

  const profit = currency(accountPrice.current - accountPrice.purchase).value;
  const profitPercent =
    profit === 0 ? 0 : currency((profit / accountPrice.purchase) * 100).value;

  return {
    id: model.id,
    title: model.title,
    visibility: model.visibility ? true : false,
    balance: model.balance,
    purchasePrice: accountPrice.purchase,
    currentPrice: accountPrice.current,
    profit: profit,
    profitPercent: profitPercent,
    items: items,
  };
};

export default convertToAccountEntity;

