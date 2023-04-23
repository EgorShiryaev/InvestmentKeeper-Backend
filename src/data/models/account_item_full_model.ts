import InvestInstrumentFullModel from './invest_instrument_full_model';

type AccountItemFullModel = {
  accountItemId: number;
  accountItemLots: number;
  accountItemAveragePrice: number;
} & InvestInstrumentFullModel;

export default AccountItemFullModel;

