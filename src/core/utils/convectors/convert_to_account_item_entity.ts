import AccountItemFullModel from '../../../data/models/account_item_full_model';
import AccountItemEntity from '../../../domain/entities/account_item_entity';
import CurrencyEntity from '../../../domain/entities/currency_entity';
import InvestInstrumentEntity from '../../../domain/entities/invest_instrument_entity';
import InvestInstrumentTypeEntity from '../../../domain/entities/invest_instrument_type_entity';

const convertToAccountItemEntity = (
  model: AccountItemFullModel,
): AccountItemEntity => {
  return {
    id: model.id,
    lots: model.lots,
    averagePrice: model.averagePrice,
    instrument: convertToInvestInstrumentEntity(model),
  };
};

export default convertToAccountItemEntity;

const convertToInvestInstrumentEntity = (
  model: AccountItemFullModel,
): InvestInstrumentEntity => {
  return {
    id: model.instrumentId,
    figi: model.instrumentFigi,
    ticker: model.instrumentTicker,
    title: model.instrumentTitle,
    about: model.instrumentAbout,
    lot: model.instrumentLot,
    type: convertToInvestInstrumentType(model.instrumentType),
    currency: convertToCurrencyEntity(model.instrumentCurrency),
  };
};

const convertToInvestInstrumentType = (
  type: string,
): InvestInstrumentTypeEntity => {
  switch (type) {
  case 'stock':
    return InvestInstrumentTypeEntity.stock;
  }
  return InvestInstrumentTypeEntity.stock;
};

const convertToCurrencyEntity = (currency: string): CurrencyEntity => {
  switch (currency) {
  case 'RUB':
    return CurrencyEntity.rub;
  }
  return CurrencyEntity.rub;
};
