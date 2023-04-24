import BaseModel from './base_model';

type AccountModel = BaseModel & {
  userId: number;
  title: string;
  visibility: boolean;
  balance: number;
};

export default AccountModel;

