import InstrumentCurrency from '../../../domain/entities/investment_instrument/instrument_currency';
import InvestmentInstrumentType from '../../../domain/entities/investment_instrument/investment_instrument_type';
import { GetResult, RunResult } from '../../databases/types';
import InvestmentInstrumentModel from '../../models/investment_instrument';

type CreateParams = {
  figi:string;
  ticker: string;
  title: string;
  numberInLot: number;
  aboutInstrument: string;
  type: InvestmentInstrumentType;
  currency: InstrumentCurrency;
};

type InvestmentInstrumentsDatasource = {
  getWhereId: (id: number) => Promise<GetResult<InvestmentInstrumentModel>>;
  create: (params: CreateParams) => Promise<RunResult>;
};

export default InvestmentInstrumentsDatasource;

