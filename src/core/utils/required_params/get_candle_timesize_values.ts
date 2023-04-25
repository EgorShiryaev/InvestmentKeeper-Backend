import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_model';

const getCandleTimesizeValues = () => {
  return [
    CandleTimesizeEntity.hour,
    CandleTimesizeEntity.day,
    CandleTimesizeEntity.week,
    CandleTimesizeEntity.month,
  ];
};

export default getCandleTimesizeValues;

