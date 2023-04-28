import AccountItemEntity from './account_item_entity';
import BaseEntity from './base_entity';

type AccountEntity = BaseEntity & {
  title: string;
  visibility: boolean;
  currencyBalance: number;
  currentItemsPrice: number;
  totalCommission: number;
  items: AccountItemEntity[];
};

export default AccountEntity;

