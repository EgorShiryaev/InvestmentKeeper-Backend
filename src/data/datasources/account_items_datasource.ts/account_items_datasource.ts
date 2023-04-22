import AccountItemFullModel from '../../models/account_item_full_model';

interface AccountItemsDatasource {
  getAllByAccountId: (accountId: number) => Promise<AccountItemFullModel[]>;
}

export default AccountItemsDatasource;

