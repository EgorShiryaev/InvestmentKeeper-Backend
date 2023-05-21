import ApiMethod from '../methods/api_method';
import WebSocketMethod from '../methods/websocket_method';

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
  getCandles: ApiMethod;
  getQuotes: WebSocketMethod;
};

export default InvestModule;

