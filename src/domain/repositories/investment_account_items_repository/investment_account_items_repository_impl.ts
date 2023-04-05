import InvestmentAccountItemsDatasource from '../../../data/datasources/investment_account_items_datasource/investment_account_items_datasource';
import InvestmentAccountItemsRepository from './investment_account_items_repository';

type Params = {
  localDatasource: InvestmentAccountItemsDatasource;
};

const InvestmentAccountItemsRepositoryImpl = ({
  localDatasource,
}: Params): InvestmentAccountItemsRepository => {
  return {
    getAll: (accountId) => {
      return localDatasource.getAll(accountId);
    },
    create: (params) => {
      return localDatasource.create(params);
    },
  };
};

export default InvestmentAccountItemsRepositoryImpl;

