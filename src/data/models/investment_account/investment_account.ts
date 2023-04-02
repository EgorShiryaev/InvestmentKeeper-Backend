import InvestmentAccountType from '../../../domain/entities/investment_account/investment_account_type';

type InvestmentAccountModel = {
  title: string;
  type: InvestmentAccountType;
  itemsId: number[];
};

export default InvestmentAccountModel;

