import AccountModel from '../../../data/models/account_model';
import AccountEntity from '../../../domain/entities/account_entity';
import InvestmentAssetEntity from '../../../domain/entities/investment_asset_entity';
import CurrencyDepositEntity from '../../../domain/entities/currency_deposit_entity';

const convertToAccountEntity = (
  model: AccountModel,
  items: InvestmentAssetEntity[],
  currencyDeposits: CurrencyDepositEntity[],
): AccountEntity => {
  return {
    id: model.id,
    title: model.title,
    items: items,
    currencyDeposits: currencyDeposits,
  };
};

export default convertToAccountEntity;

