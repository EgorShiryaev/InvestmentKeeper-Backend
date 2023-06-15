import BaseModel from './base_model';

type CurrencyDepositModel = BaseModel & {
  currency_id: number;
  value: number;
};

export default CurrencyDepositModel;

