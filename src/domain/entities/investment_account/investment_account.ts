
// import InvestmentAccountInstrumentEntity from './investment_account_instrument';
import InvestmentAccountType from './investment_account_type';

type InvestmentAccountEntity = {
  title: string;
  type: InvestmentAccountType;
  visibility: boolean,
  // TODO: раскомментировать как будет готово выдавать инструменты
  // items: InvestmentAccountInstrumentEntity[];
  itemsId: number[];
};

export default InvestmentAccountEntity;

