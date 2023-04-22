import AccountItemEntity from './account_item_entity';
import BaseEntity from './base_entity';

type AccountEntity = BaseEntity & {
  title: string;
  visibility: boolean;
  items: AccountItemEntity[];
};

export default AccountEntity;

