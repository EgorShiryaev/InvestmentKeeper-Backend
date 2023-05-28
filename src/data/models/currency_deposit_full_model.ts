import BaseModel from './base_model';

type CurrencyDepositFullModel = BaseModel & {
  currencyDepositValue: number;
  currencyDepositCurrency: string;
};

export default CurrencyDepositFullModel;

