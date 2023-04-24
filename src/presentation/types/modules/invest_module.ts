import ApiMethod from '../../api/api';

type InvestModule = {
  getAccounts: ApiMethod;
  createAccount: ApiMethod;
  updateAccount: ApiMethod;
  changeVisibilityAccount: ApiMethod;
  searchInvestInstrument: ApiMethod;
  createSale: ApiMethod;
  createPurchase: ApiMethod;
  createRefill: ApiMethod;
  createWithdrawal: ApiMethod;
};

export default InvestModule;

