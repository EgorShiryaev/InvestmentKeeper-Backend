import InvestmentInstrumentType from '../../../domain/entities/investment_instrument/investment_instrument_type';
import { GetResult, RunResult } from '../../databases/types';
import InvestmentInstrumentModel from '../../models/investment_instrument';

type CreateParams = {
  ticker: string;
  title: string;
  numberInLot: number;
  aboutInstrument: string;
  type: InvestmentInstrumentType;
};

type InvestmentInstrumentsDatasource = {
  getWhereId: (id: number) => Promise<GetResult<InvestmentInstrumentModel>>;
  create: (params: CreateParams) => Promise<RunResult>;
};

export default InvestmentInstrumentsDatasource;

