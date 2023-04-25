import AccountModel from '../../models/account_model';
import InstrumentCommentModel from '../../models/instrument_comment_model';

interface InstrumentCommentsDatasource {
  getByUserIdAndInstrumentId: (
    userId: number,
    instrumentId: number,
  ) => Promise<InstrumentCommentModel | undefined>;
}

export default InstrumentCommentsDatasource;

