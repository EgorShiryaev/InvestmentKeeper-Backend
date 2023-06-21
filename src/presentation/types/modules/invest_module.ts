import ApiMethod from '../methods/api_method';

type InvestModule = {
  getAllAccounts: ApiMethod;
  getAccount: ApiMethod;
  createAccount: ApiMethod;
  updateAccount: ApiMethod;
  createSale: ApiMethod;
  createPurchase: ApiMethod;
  createRefill: ApiMethod;
  createWithdrawal: ApiMethod;
  searchInvestInstrument: ApiMethod;
  getCandles: ApiMethod;
  getInstrumentPrice: ApiMethod;
};

export default InvestModule;

