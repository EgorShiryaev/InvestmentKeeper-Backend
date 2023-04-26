import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_entity';

type GetCandlesRequestData = {
  instrumentId: number;
  candleTimesize: CandleTimesizeEntity;
  from: string;
  to: string;
};

export default GetCandlesRequestData;

