import { MarketInstrument } from '@tinkoff/invest-openapi-js-sdk';
import InvestmentInstrument from '../../../../domain/entities/investment_instrument/investment_instrument';
import convertToInstrumentCurrency from './convert_to_instrument_currency';
import convertToInstrumentType from './convert_to_instrument_type';

const convertToInvestmentInstrument = (
  instrument: MarketInstrument,
): InvestmentInstrument => {
  return {
    figi: instrument.figi,
    ticker: instrument.ticker,
    title: instrument.name,
    numberInLot: instrument.lot,
    aboutInstrument: '',
    type: convertToInstrumentType(instrument.type),
    currency: convertToInstrumentCurrency(instrument.currency),
  };
};

export default convertToInvestmentInstrument;

