import { InstrumentType as TinkoffInstrumentType } from '@tinkoff/invest-openapi-js-sdk';
import InvestmentInstrumentType from '../../../../domain/entities/investment_instrument/investment_instrument_type';

const convertToInstrumentType = (
  type: TinkoffInstrumentType,
): InvestmentInstrumentType => {
  switch (type) {
  case 'Stock':
    return InvestmentInstrumentType.stock;
  case 'Currency':
    return InvestmentInstrumentType.curency;
  case 'Bond':
    return InvestmentInstrumentType.bond;
  case 'Etf':
    return InvestmentInstrumentType.etf;
  }
};

export default convertToInstrumentType;
