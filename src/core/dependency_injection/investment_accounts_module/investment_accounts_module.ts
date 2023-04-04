import Api from '../../../presentation/api/api';

type InvestmentAccountsModule = {
  getUserInvestmentAccounts: Api;
  createInvestmentAccount: Api;
  updateInvestmentAccount: Api;
};

export default InvestmentAccountsModule;

