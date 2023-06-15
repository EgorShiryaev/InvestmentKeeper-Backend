import BaseModel from './base_model';

type AccountModel = BaseModel & {
  user_id: number;
  title: string;
};

export default AccountModel;

