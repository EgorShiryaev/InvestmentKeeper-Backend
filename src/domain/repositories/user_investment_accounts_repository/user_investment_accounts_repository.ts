import InvestmentAccountModel from '../../../data/models/investment_account/investment_account';
import InvestmentAccountType from '../../entities/investment_account/investment_account_type';

type CreateParams = {
  userId: number;
  title: string;
  type: InvestmentAccountType;
};
type UserInvestmentAccountsRepository = {
  getAll: (userId: number) => Promise<InvestmentAccountModel[]>;
  create: (params: CreateParams) => Promise<void>;
};

export default UserInvestmentAccountsRepository;

