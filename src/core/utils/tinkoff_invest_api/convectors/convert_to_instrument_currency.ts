import { Currency } from '@tinkoff/invest-openapi-js-sdk';
import InstrumentCurrency from '../../../../domain/entities/investment_instrument/instrument_currency';

const convertToInstrumentCurrency = (
  currency?: Currency,
): InstrumentCurrency => {
  switch (currency) {
  case 'RUB':
    return InstrumentCurrency.RUB;
  case 'USD':
    return InstrumentCurrency.USD;
  case 'EUR':
    return InstrumentCurrency.USD;
  case 'GBP':
    return InstrumentCurrency.GBP;
  case 'HKD':
    return InstrumentCurrency.HKD;
  case 'CHF':
    return InstrumentCurrency.CHF;
  case 'JPY':
    return InstrumentCurrency.JPY;
  case 'CNY':
    return InstrumentCurrency.CNY;
  case 'TRY':
    return InstrumentCurrency.TRY;
  default:
    return InstrumentCurrency.RUB;
  }
};

export default convertToInstrumentCurrency;

