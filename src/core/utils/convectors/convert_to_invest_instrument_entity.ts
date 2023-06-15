import InvestInstrumentFullModel from '../../../data/models/invest_instrument_full_model';
import InvestInstrumentEntity from '../../../domain/entities/invest_instrument_entity';
import convertToCurrencyEntity from './convert_to_currency_entity';
import convertToInvestInstrumentTypeEntity from './convert_to_invest_instrument_type_entity';

const convertToInvestInstrumentEntity = (
  model: InvestInstrumentFullModel,
): InvestInstrumentEntity => {
  return {
    id: model.instrument_id,
    figi: model.instrument_figi,
    ticker: model.instrument_ticker,
    title: model.instrument_title,
    lot: model.instrument_lot,
    type: convertToInvestInstrumentTypeEntity(model.instrument_type),
    currency: convertToCurrencyEntity(model.instrument_currency),
  };
};

export default convertToInvestInstrumentEntity;

