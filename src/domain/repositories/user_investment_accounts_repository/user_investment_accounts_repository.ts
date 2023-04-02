import InvestmentAccountModel from '../../../data/models/investment_account/investment_account';

type UserInvestmentAccountsRepository = {
  getAll: (userId: number) => Promise<InvestmentAccountModel[]>;
};

export default UserInvestmentAccountsRepository;

