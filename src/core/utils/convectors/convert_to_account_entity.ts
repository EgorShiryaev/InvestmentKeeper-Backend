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
      const purchasePrice = current.averagePurchasePrice * lots;
      const currentPrice = (current.currentPrice ?? 0) * lots;
      return {
        purchase: prev.purchase + purchasePrice,
        current: prev.current + currentPrice,
      };
    },
    {
      purchase: 0,
      current: 0,
    },
  );

  return {
    id: model.id,
    title: model.title,
    visibility: model.visibility ? true : false,
    balance: model.balance,
    purchasePrice: accountPrice.purchase,
    currentPrice: accountPrice.current,
    items: items,
  };
};

export default convertToAccountEntity;

