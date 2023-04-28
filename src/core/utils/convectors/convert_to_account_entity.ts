import currency from 'currency.js';
import AccountModel from '../../../data/models/account_model';
import AccountEntity from '../../../domain/entities/account_entity';
import AccountItemEntity from '../../../domain/entities/account_item_entity';

const convertToAccountEntity = (
  model: AccountModel,
  items: AccountItemEntity[],
): AccountEntity => {
  const currentItemsPrice = items.reduce((prev, current) => {
    const lots = current.lots * current.instrument.lot;
    const currentPrice = currency((current.currentPrice ?? 0) * lots).value;
    return currency(prev + currentPrice).value;
  }, 0);

  return {
    id: model.id,
    title: model.title,
    visibility: model.visibility ? true : false,
    currencyBalance: model.currencyBalance,
    currentItemsPrice: currentItemsPrice,
    totalCommission: model.totalCommission,
    items: items,
  };
};

export default convertToAccountEntity;

