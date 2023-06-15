import BaseModel from './base_model';

type InvestInstrumentModel = BaseModel & {
  type_id: number;
  currency_id: number;
  figi: string;
  ticker: string;
  title: string;
  lot: number;
};

export default InvestInstrumentModel;

