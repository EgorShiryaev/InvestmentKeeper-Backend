import CandleModel from '../../../data/models/candle_model';
import CandleEntity from '../../../domain/entities/candle_entity';

const convertToCandleEntity = (model: CandleModel): CandleEntity => {
  return {
    open: model.o,
    close: model.c,
    high: model.h,
    low: model.l,
    volume: model.v,
    time: new Date(model.time),
  };
};

export default convertToCandleEntity;