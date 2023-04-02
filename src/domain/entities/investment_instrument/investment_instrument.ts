import InvestmentInstrumentType from './investment_instrument_type';

type InvestmentInstrument = {
  ticker: string;
  title: string;
  numberInLot: number;
  aboutInstrument: string;
  type: InvestmentInstrumentType;
};

export default InvestmentInstrument;
