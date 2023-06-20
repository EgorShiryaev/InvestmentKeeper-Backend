import CandleModel from '../../../data/models/candle_model';
import CandleEntity from '../../../domain/entities/candle_entity';

const convertToCandleEntity = (model: CandleModel): CandleEntity => {
  return {
    open: model.open,
    close: model.close,
    high: model.high,
    low: model.low,
    volume: model.volume,
    time: model.time,
    isComplete: model.isComplete,
  };
};

export default convertToCandleEntity;

