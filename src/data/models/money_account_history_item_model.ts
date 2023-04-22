import BaseModel from './base_model';

type MoneyAccountHistoryItemModel = BaseModel & {
  typeId: number;
  accountId: number;
  instrumentId: number;
  dateTimeUnix: number;
  value: number;
};

export default MoneyAccountHistoryItemModel;

