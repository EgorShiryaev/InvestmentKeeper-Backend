import BaseModel from './base_model';

type AccountModel = BaseModel & {
  userId: number;
  title: string;
  visibility: boolean;
  currencyBalance: number;
  totalCommission: number;
};

export default AccountModel;

