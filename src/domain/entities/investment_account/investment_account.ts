import CreateInvestmentAccountData from '../api_data/create_investment_account_data';
import InvestmentAccountInstrumentEntity from './investment_account_instrument';

type InvestmentAccountEntity = CreateInvestmentAccountData & {
  items: InvestmentAccountInstrumentEntity[];
};

export default InvestmentAccountEntity;

