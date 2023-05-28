import InvestInstrumentFullModel from '../../../data/models/invest_instrument_full_model';
import InvestInstrumentEntity from '../../../domain/entities/invest_instrument_entity';
import convertToCurrencyEntity from './convert_to_currency_entity';
import convertToInvestInstrumentTypeEntity from './convert_to_invest_instrument_type_entity';

const convertToInvestInstrumentEntity = (
  model: InvestInstrumentFullModel,
): InvestInstrumentEntity => {
  return {
    id: model.instrumentId,
    figi: model.instrumentFigi,
    ticker: model.instrumentTicker,
    title: model.instrumentTitle,
    lot: model.instrumentLot,
    type: convertToInvestInstrumentTypeEntity(model.instrumentType),
    currency: convertToCurrencyEntity(model.instrumentCurrency),
  };
};

export default convertToInvestInstrumentEntity;

