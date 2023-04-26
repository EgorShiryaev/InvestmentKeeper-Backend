import { Helpers } from 'tinkoff-invest-api';
import CandleModel from '../../../data/models/candle_model';
import CandleEntity from '../../../domain/entities/candle_entity';

const convertToCandleEntity = (model: CandleModel): CandleEntity => {
  return {
    open: Helpers.toNumber(model.open),
    close: Helpers.toNumber(model.close),
    high: Helpers.toNumber(model.high),
    low: Helpers.toNumber(model.low),
    volume: model.volume,
    time: model.time,
    isComplete: model.isComplete,
  };
};

export default convertToCandleEntity;

