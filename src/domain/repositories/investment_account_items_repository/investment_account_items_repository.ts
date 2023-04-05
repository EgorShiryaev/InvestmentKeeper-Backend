import { RunResult } from '../../../data/databases/types';
import InvestmentAccountItemModel from '../../../data/models/investment_account_item';

export type CreateInvestmentAccountItemParams = {
    accountId: number;
    instrumentId: number;
    lotsNumber: number;
    lotAveragePrice: number;
  };
  

type InvestmentAccountItemsRepository = {
    getAll: (accountId: number) => Promise<InvestmentAccountItemModel[]>;
   create: (params: CreateInvestmentAccountItemParams) => Promise<RunResult>
}

export default InvestmentAccountItemsRepository;