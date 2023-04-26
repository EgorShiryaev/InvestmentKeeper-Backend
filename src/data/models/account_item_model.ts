import BaseModel from './base_model';

type AccountItemModel = BaseModel & {
  accountId: number;
  instrumentId: number;
  lots: number;
  averagePurchasePrice: number;
};

export default AccountItemModel;

