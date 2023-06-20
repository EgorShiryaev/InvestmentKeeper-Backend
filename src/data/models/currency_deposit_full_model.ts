import BaseModel from './base_model';

type CurrencyDepositFullModel = BaseModel & {
  value_units: number;
  value_nano: number;
  currency: string;
};

export default CurrencyDepositFullModel;

