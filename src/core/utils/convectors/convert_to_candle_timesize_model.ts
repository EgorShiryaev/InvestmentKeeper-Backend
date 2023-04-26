import CandleTimesizeModel from '../../../data/models/candle_timesize_model';
import CandleTimesizeEntity from '../../../domain/entities/candle_timesize_entity';

const convertToCandleTimesizeModel = (
  entity: CandleTimesizeEntity,
): CandleTimesizeModel => {
  switch (entity) {
  case CandleTimesizeEntity.hour:
    return CandleTimesizeModel.hour;
  case CandleTimesizeEntity.twoHours:
    return CandleTimesizeModel.twoHours;
  case CandleTimesizeEntity.fourHours:
    return CandleTimesizeModel.fourHours;
  case CandleTimesizeEntity.day:
    return CandleTimesizeModel.day;
  case CandleTimesizeEntity.week:
    return CandleTimesizeModel.week;
  case CandleTimesizeEntity.month:
    return CandleTimesizeModel.month;
  }
  return CandleTimesizeModel.day;
};

export default convertToCandleTimesizeModel;
