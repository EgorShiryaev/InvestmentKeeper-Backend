import BaseModel from './base_model';

type CurrencyDepositModel = BaseModel & {
  currencyId: number;
  value: number;
};

export default CurrencyDepositModel;

