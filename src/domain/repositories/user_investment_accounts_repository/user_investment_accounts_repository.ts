import { RunResult } from '../../../data/databases/types';
import InvestmentAccountModel from '../../../data/models/investment_account/investment_account';
import UpdateInvestmentAccountData from '../../entities/api/investment_account/update_investment_account_data';
import InvestmentAccountType from '../../entities/investment_account/investment_account_type';

type CreateParams = {
  userId: number;
  title: string;
  type: InvestmentAccountType;
};

type UserInvestmentAccountsRepository = {
  getAll: (userId: number) => Promise<InvestmentAccountModel[]>;
  create: (params: CreateParams) => Promise<RunResult>;
  update: (params: UpdateInvestmentAccountData) => Promise<RunResult>;
};

export default UserInvestmentAccountsRepository;

