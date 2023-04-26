import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_entity';

const getCandleTimesizeValues = () => {
  return [
    CandleTimesizeEntity.hour,
    CandleTimesizeEntity.twoHours,
    CandleTimesizeEntity.fourHours,
    CandleTimesizeEntity.day,
    CandleTimesizeEntity.week,
    CandleTimesizeEntity.month,
  ];
};

export default getCandleTimesizeValues;

