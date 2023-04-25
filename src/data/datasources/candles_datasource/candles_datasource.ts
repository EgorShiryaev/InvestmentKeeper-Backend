import CandleModel from '../../models/candle_model';
import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_model';

type GetData = {
  from: string;
  to: string;
  figi: string;
  candleTimesize: CandleTimesizeEntity;
};

interface CandlesDatasource {
  get: (data: GetData) => Promise<CandleModel[]>;
}

export default CandlesDatasource;

