import BaseModel from './base_model';

type FinancialOperationModel = BaseModel & {
  accountId: number;
  date: string;
  value: number;
};

export default FinancialOperationModel;

