import BaseModel from './base_model';

type CurrencyDepositModel = BaseModel & {
  currency_id: number;
  value_units: number;
  value_nano: number;
};

export default CurrencyDepositModel;

