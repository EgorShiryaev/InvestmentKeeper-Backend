import { RunResult } from '../../../data/databases/types';
import UpdateInvestmentAccountData from '../../entities/api/investment_account/update_investment_account_data';
import InvestmentAccountEntity from '../../entities/investment_account/investment_account';
import InvestmentAccountType from '../../entities/investment_account/investment_account_type';

type CreateParams = {
  userId: number;
  title: string;
  type: InvestmentAccountType;
};

type UserInvestmentAccountsRepository = {
  getAll: (userId: number) => Promise<InvestmentAccountEntity[]>;
  create: (params: CreateParams) => Promise<RunResult>;
  update: (params: UpdateInvestmentAccountData) => Promise<RunResult>;
};

export default UserInvestmentAccountsRepository;

