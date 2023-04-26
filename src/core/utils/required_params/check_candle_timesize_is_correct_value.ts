import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_entity';

const checkCandleTimesizeIsCorrectValue = (timesize: string): boolean => {
  return (
    timesize === CandleTimesizeEntity.hour ||
    timesize === CandleTimesizeEntity.twoHours ||
    timesize === CandleTimesizeEntity.fourHours ||
    timesize === CandleTimesizeEntity.day ||
    timesize === CandleTimesizeEntity.week ||
    timesize === CandleTimesizeEntity.month
  );
};

export default checkCandleTimesizeIsCorrectValue;

