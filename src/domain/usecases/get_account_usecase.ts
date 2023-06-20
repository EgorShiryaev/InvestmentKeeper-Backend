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

export type GetAccountUsecase = {
  call: (id: number) => Promise<AccountEntity | undefined>;
};

const GetAccountUsecaseImpl = ({
  accountsDatasource,
  investmentAssetsDatasource,
  currencyDepositsDatasource,
  instrumentPriceRepository,
}: Params): GetAccountUsecase => {
  const getItems = (accountId: number): Promise<InvestmentAssetEntity[]> => {
    return investmentAssetsDatasource
      .getAllByAccountIdAndLotsGreaterZero(accountId)
      .then((items) => {
        return items.map((v) => {
          const price = instrumentPriceRepository.get(v.instrument_figi);
          return convertToInvestmentAssetEntity(v, price);
        });
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
    call: (id: number) => {
      return accountsDatasource.getById(id).then((account) => {
        if (!account) {
          return undefined;
        }
        return Promise.all([
          getItems(account.id),
          getCurrencyDeposits(account.id),
        ]).then(([items, currencyDeposits]) =>
          convertToAccountEntity(account, items, currencyDeposits),
        );
      });
    },
  };
};

export default GetAccountUsecaseImpl;

