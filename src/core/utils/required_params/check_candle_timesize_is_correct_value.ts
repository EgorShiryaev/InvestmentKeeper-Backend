import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_model';

const checkCandleTimesizeIsCorrectValue = (timesize: string) => {
  return (
    timesize === CandleTimesizeEntity.hour ||
    timesize === CandleTimesizeEntity.day ||
    timesize === CandleTimesizeEntity.week ||
    timesize === CandleTimesizeEntity.month
  );
};

export default checkCandleTimesizeIsCorrectValue;

