import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_model';

type GetCandlesRequestData = {
  instrumentId: number;
  candleTimesize: CandleTimesizeEntity;
  from: string;
  to: string;
};

export default GetCandlesRequestData;

