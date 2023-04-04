import InvestmentAccountType from '../../../domain/entities/investment_account/investment_account_type';
import InvestmentAccountModel from '../../models/investment_account/investment_account';

type CreateParams = {
  userId: number;
  title: string;
  type: InvestmentAccountType;
};

type UserInvestmentAccountsDatasource = {
  getAll: (userId: number) => Promise<InvestmentAccountModel[]>;
  create: (params: CreateParams) => Promise<void>;
};

export default UserInvestmentAccountsDatasource;
