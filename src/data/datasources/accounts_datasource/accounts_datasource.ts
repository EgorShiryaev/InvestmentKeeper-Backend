import AccountModel from '../../models/account_model';

type CreateAccountData = {
  userId: number;
  title: string;
};

type UpdateAccountData = {
  id: number;
  title?: string;
  balance?: number;
};

interface AccountsDatasource {
  getAllByUserId: (userId: number) => Promise<AccountModel[]>;
  create: (data: CreateAccountData) => Promise<number>;
  update: (data: UpdateAccountData) => Promise<number>;
  getById: (id: number) => Promise<AccountModel | undefined>;
}

export default AccountsDatasource;

