import InstrumentCurrency from './instrument_currency';
import InvestmentInstrumentType from './investment_instrument_type';

type InvestmentInstrument = {
  figi: string;
  ticker: string;
  title: string;
  numberInLot: number;
  aboutInstrument: string;
  type: InvestmentInstrumentType;
  currency: InstrumentCurrency;
};

export default InvestmentInstrument;

