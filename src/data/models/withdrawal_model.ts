import BaseModel from './base_model';

type WithdrawalModel = BaseModel & {
  accountId: number;
  date: string;
  value: number;
};

export default WithdrawalModel;

