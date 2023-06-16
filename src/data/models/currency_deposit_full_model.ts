import BaseModel from './base_model';

type CurrencyDepositFullModel = BaseModel & {
  currency_deposit_value: number;
  currency_deposit_currency: string;
};

export default CurrencyDepositFullModel;

