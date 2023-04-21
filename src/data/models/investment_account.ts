import InvestmentAccountType from '../../domain/entities/investment_account/investment_account_type';

type InvestmentAccountModel = {
  id: number,
  title: string;
  type: InvestmentAccountType;
  visibility: number;
  itemsId: number[];
};

export default InvestmentAccountModel;
