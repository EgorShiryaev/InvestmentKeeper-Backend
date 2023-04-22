import ApiMethod from '../../api/api';

type InvestModule = {
  getAccounts: ApiMethod;
  createAccount: ApiMethod;
  updateAccount: ApiMethod;
  changeVisibilityAccount: ApiMethod;
};

export default InvestModule;

