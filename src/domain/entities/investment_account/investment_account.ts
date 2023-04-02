import InvestmentAccountInstrumentEntity from './investment_account_instrument';
import InvestmentAccountType from './investment_account_type';

type InvestmentAccountEntity = {
  title: string;
  type: InvestmentAccountType;
  items: InvestmentAccountInstrumentEntity[];
};

export default InvestmentAccountEntity;

