import BaseModel from './base_model';

type CurrencyModel = BaseModel & {
  value: string;
};

export default CurrencyModel;

