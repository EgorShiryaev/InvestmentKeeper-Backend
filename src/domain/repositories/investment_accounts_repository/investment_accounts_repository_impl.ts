import NotFoundException from '../../../core/exceptions/not_found_exception';
import InvestmentAccountsDatasource from '../../../data/datasources/investment_accounts_datasource/investment_accounts_datasource';
import InvestmentAccountsRepository from './user_investment_accounts_repository';

type Params = {
  localDatasource: InvestmentAccountsDatasource;
};

const InvestmentAccountsRepositoryImpl = ({
  localDatasource,
}: Params): InvestmentAccountsRepository => {
  return {
    getAll: async (userId) => {
      const records = await localDatasource.getAll(userId);

      return records.map((v) => ({
        ...v,
        visibility: v.visibility ? true : false,
      }));
    },
    create: (params) => {
      return localDatasource.create(params);
    },
    update: async (params) => {
      const result = await localDatasource.update(params);
      if (!result.changes) {
        throw NotFoundException();
      }
      return result;
    },
  };
};

export default InvestmentAccountsRepositoryImpl;

