// import InvestmentAccountInstrumentEntity from './investment_account_instrument';
import InvestmentAccountType from './investment_account_type';

type InvestmentAccountEntity = {
  id: number;
  title: string;
  type: InvestmentAccountType;
  visibility: boolean;
};

export default InvestmentAccountEntity;

