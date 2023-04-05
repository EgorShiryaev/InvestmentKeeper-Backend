import { CreateInvestmentAccountItemParams } from '../../../domain/repositories/investment_account_items_repository/investment_account_items_repository';
import { GetResult, RunResult } from '../../databases/types';
import InvestmentAccountItemModel from '../../models/investment_account_item';


type UpdateParams = {
  id: number;
  lotsNumber: number;
  lotAveragePrice: number;
};

type InvestmentAccountItemsDatasource = {
  getAll: (accountId: number) => Promise<InvestmentAccountItemModel[]>;
  getWhereId: (id: number) => Promise<GetResult<InvestmentAccountItemModel>>;
  create: (params: CreateInvestmentAccountItemParams) => Promise<RunResult>;
  update: (params: UpdateParams) => Promise<RunResult>;
  delete: (id: number) => Promise<RunResult>;
};

export default InvestmentAccountItemsDatasource;

