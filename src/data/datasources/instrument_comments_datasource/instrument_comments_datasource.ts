import InstrumentCommentModel from '../../models/instrument_comment_model';

type CreateInstrumentCommentData = {
  userId: number;
  instrumentId: number;
  comment: string;
};

type UpdateInstrumentCommentData = {
  id: number;
  comment: string;
};

interface InstrumentCommentsDatasource {
  getByUserIdAndInstrumentId: (
    userId: number,
    instrumentId: number,
  ) => Promise<InstrumentCommentModel | undefined>;
  create: (data: CreateInstrumentCommentData) => Promise<number>;
  update: (data: UpdateInstrumentCommentData) => Promise<number>;
  delete: (id: number) => Promise<number>;
}

export default InstrumentCommentsDatasource;

