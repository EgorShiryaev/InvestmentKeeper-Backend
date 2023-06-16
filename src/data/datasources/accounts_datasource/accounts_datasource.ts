import AccountModel from '../../models/account_model';

type CreateAccountData = {
  userId: number;
  currencyId: number;
  title: string;
};

type UpdateAccountData = {
  id: number;
  title?: string;
};

interface AccountsDatasource {
  getAllByUserId: (userId: number) => Promise<AccountModel[]>;
  create: (data: CreateAccountData) => Promise<number>;
  update: (data: UpdateAccountData) => Promise<void>;
  getById: (id: number) => Promise<AccountModel | undefined>;
}

export default AccountsDatasource;

