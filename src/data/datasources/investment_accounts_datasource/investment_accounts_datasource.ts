import UpdateInvestmentAccountData from '../../../domain/entities/api/investment_account/update_investment_account_data';
import InvestmentAccountType from '../../../domain/entities/investment_account/investment_account_type';
import { RunResult } from '../../databases/types';
import InvestmentAccountModel from '../../models/investment_account/investment_account';

type CreateParams = {
  userId: number;
  title: string;
  type: InvestmentAccountType;
};

type InvestmentAccountsDatasource = {
  getAll: (userId: number) => Promise<InvestmentAccountModel[]>;
  create: (params: CreateParams) => Promise<RunResult>;
  update: (params: UpdateInvestmentAccountData) => Promise<RunResult>;
};

export default InvestmentAccountsDatasource;

