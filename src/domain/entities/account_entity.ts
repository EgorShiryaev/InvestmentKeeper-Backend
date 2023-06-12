import InvestmentAssetEntity from './investment_asset_entity';
import BaseEntity from './base_entity';
import CurrencyDepositEntity from './currency_deposit_entity';

type AccountEntity = BaseEntity & {
  title: string;
  purchasePrice: number;
  currentPrice: number;
  items: InvestmentAssetEntity[];
  currencyDeposits: CurrencyDepositEntity[];
};

export default AccountEntity;

