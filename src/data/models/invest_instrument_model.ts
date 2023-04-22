import BaseModel from './base_model';

type InvestInstrumentModel = BaseModel & {
  typeId: number;
  currencyId: number;
  figi: string;
  ticker: string;
  title: string;
  lot: number;
  about: string;
};

export default InvestInstrumentModel;

