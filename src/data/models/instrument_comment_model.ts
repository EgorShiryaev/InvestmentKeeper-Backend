import BaseModel from './base_model';

type InstrumentCommentModel = BaseModel & {
  userId: number;
  instrumentId: number;
  comment: string;
};

export default InstrumentCommentModel;

