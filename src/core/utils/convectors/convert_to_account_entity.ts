import AccountModel from '../../../data/models/account_model';
import AccountEntity from '../../../domain/entities/account_entity';
import AccountItemEntity from '../../../domain/entities/account_item_entity';

const convertToAccountEntity = (
  model: AccountModel,
  items: AccountItemEntity[],
): AccountEntity => {
  return {
    id: model.id,
    title: model.title,
    visibility: model.visibility ? true : false,
    balance: model.balance,
    items: items,
  };
};

export default convertToAccountEntity;
