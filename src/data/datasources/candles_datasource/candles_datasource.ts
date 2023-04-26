import CandleModel from '../../models/candle_model';
import CandleTimesizeModel from '../../models/candle_timesize_model';

export type GetCandleData = {
  from: Date;
  to: Date;
  figi: string;
  candleTimesize: CandleTimesizeModel;
};

interface CandlesDatasource {
  get: (data: GetCandleData) => Promise<CandleModel[]>;
}

export default CandlesDatasource;

