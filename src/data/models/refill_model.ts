import BaseModel from './base_model';

type RefillModel = BaseModel & {
  accountId: number;
  date: string;
  value: number;
};

export default RefillModel;

