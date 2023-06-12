import ApiMethod from '../methods/api_method';

type InvestModule = {
  getAccounts: ApiMethod;
  createAccount: ApiMethod;
  updateAccount: ApiMethod;
  createSale: ApiMethod;
  createPurchase: ApiMethod;
  createRefill: ApiMethod;
  createWithdrawal: ApiMethod;
  searchInvestInstrument: ApiMethod;
  getCandles: ApiMethod;
  getInstrumentPrice: ApiMethod;
  getAccountPrice: ApiMethod;
};

export default InvestModule;

