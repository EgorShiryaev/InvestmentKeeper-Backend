import BaseModel from './base_model';

type InstrumentAccountHistoryItemModel = BaseModel & {
  typeId: number;
  accountId: number;
  instrumentId: number;
  dateTimeUnix: number;
  lots: number;
  price: number;
};

export default InstrumentAccountHistoryItemModel;

