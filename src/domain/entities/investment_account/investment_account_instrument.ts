import InvestmentInstrument from '../investment_instrument/investment_instrument';

type InvestmentAccountInstrumentEntity = InvestmentInstrument & {
  lotsNumber: number;
  lotAveragePrice: number;
};

export default InvestmentAccountInstrumentEntity;

