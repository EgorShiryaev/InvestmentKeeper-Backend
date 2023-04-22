import BaseModel from './base_model';

type AccountModel = BaseModel & {
  userId: number;
  title: string;
  visibility: boolean;
};

export default AccountModel;

