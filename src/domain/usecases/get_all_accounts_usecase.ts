import convertToAccountEntity from '../../core/utils/convectors/convert_to_account_entity';
import convertToCurrencyDepositEntity from '../../core/utils/convectors/convert_to_currency_deposit_entity';
import convertToInvestmentAssetEntity from '../../core/utils/convectors/convert_to_investment_asset_entity';
import AccountsDatasource from '../../data/datasources/accounts_datasource/accounts_datasource';
import CurrencyDepositsDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import InvestmentAssetsDatasource from '../../data/datasources/investment_assets_datasource/investment_assets_datasource';
import AccountEntity from '../entities/account_entity';
import CurrencyDepositEntity from '../entities/currency_deposit_entity';
import InvestmentAssetEntity from '../entities/investment_asset_entity';
import { InstrumentPriceRepository } from '../repositories/instrument_price_repository_impl';

type Params = {
  accountsDatasource: AccountsDatasource;
  investmentAssetsDatasource: InvestmentAssetsDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
  instrumentPriceRepository: InstrumentPriceRepository;
};

export type GetAllAccountsUsecase = {
  call: (userId: number) => Promise<AccountEntity[]>;
};

const GetAllAccountsUsecaseImpl = ({
  accountsDatasource,
  investmentAssetsDatasource,
  currencyDepositsDatasource,
  instrumentPriceRepository,
}: Params): GetAllAccountsUsecase => {
  const getItems = (accountId: number): Promise<InvestmentAssetEntity[]> => {
    return investmentAssetsDatasource
      .getAllByAccountIdAndLotsGreaterZero(accountId)
      .then((items) => {
        return Promise.all(
          items.map((v) => {
            const price = instrumentPriceRepository.get(v.instrument_figi);
            return convertToInvestmentAssetEntity(v, price);
          }),
        );
      });
  };

  const getCurrencyDeposits = (
    accountId: number,
  ): Promise<CurrencyDepositEntity[]> => {
    return currencyDepositsDatasource
      .getAllByAccountId({
        accountId: accountId,
      })
      .then((currencyDeposits) => {
        return Promise.all(
          currencyDeposits.map(convertToCurrencyDepositEntity),
        );
      });
  };

  return {
    call: (userId: number) => {
      return accountsDatasource.getAllByUserId(userId).then((accounts) => {
        return Promise.all(
          accounts.map(async (account) => {
            const items = await getItems(account.id);
            const currencyDeposits = await getCurrencyDeposits(account.id);
            return convertToAccountEntity(account, items, currencyDeposits);
          }),
        );
      });
    },
  };
};

export default GetAllAccountsUsecaseImpl;

