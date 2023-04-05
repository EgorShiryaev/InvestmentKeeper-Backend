import { GetResult } from '../../../data/databases/types';
import InvestmentInstrumentModel from '../../../data/models/investment_instrument';

type InvestmentInstrumentsRepository = {
  getWhereId: (id: number) => Promise<GetResult<InvestmentInstrumentModel>>;
};

export default InvestmentInstrumentsRepository;
