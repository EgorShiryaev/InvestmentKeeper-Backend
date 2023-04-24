import AccountItemFullModel from '../../models/account_item_full_model';
import AccountItemModel from '../../models/account_item_model';

type CreateAccountItemData = {
  accountId: number;
  instrumentId: number;
};

type UpdateAccountItemData = {
  id: number;
  lots: number;
  averagePrice?: number;
};

interface AccountItemsDatasource {
  getAllByAccountIdAndLotsGreaterZero: (
    accountId: number,
  ) => Promise<AccountItemFullModel[]>;
  getByAccountIdAndInstrumentId: (
    accountId: number,
    instrumentId: number,
  ) => Promise<AccountItemModel | undefined>;
  create: (data: CreateAccountItemData) => Promise<number>;
  update: (data: UpdateAccountItemData) => Promise<number>;
}

export default AccountItemsDatasource;

