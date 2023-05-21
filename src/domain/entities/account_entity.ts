import AccountItemEntity from './account_item_entity';
import BaseEntity from './base_entity';

type AccountEntity = BaseEntity & {
  title: string;
  balance: number;
  purchasePrice: number;
  currentPrice: number;
  profit: number;
  profitPercent: number;
  items: AccountItemEntity[];
};

export default AccountEntity;

