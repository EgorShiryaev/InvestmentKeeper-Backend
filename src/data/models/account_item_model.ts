import BaseModel from './base_model';

type AccountItemModel = BaseModel & {
  accountId: number;
  instrumentId: number;
  lots: number;
  averagePrice: number;
};

export default AccountItemModel;

