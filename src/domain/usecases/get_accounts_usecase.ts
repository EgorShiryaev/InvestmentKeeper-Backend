import convertToAccountEntity from '../../core/utils/convectors/convert_to_account_entity';
import convertToCurrencyDepositEntity from '../../core/utils/convectors/convert_to_currency_deposit_entity';
import convertToInvestmentAssetEntity from '../../core/utils/convectors/convert_to_investment_asset_entity';
import AccountsDatasource from '../../data/datasources/accounts_datasource/accounts_datasource';
import CurrencyDepositsDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import InstrumentPriceDatasource from '../../data/datasources/instrument_price_datasource/instrument_price_datasource';
import InvestmentAssetsDatasource from '../../data/datasources/investment_assets_datasource/investment_assets_datasource';
import AccountEntity from '../entities/account_entity';
import CurrencyDepositEntity from '../entities/currency_deposit_entity';
import InvestmentAssetEntity from '../entities/investment_asset_entity';

type Params = {
  accountsDatasource: AccountsDatasource;
  investmentAssetsDatasource: InvestmentAssetsDatasource;
  instrumentPriceDatasource: InstrumentPriceDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
};

export type GetAccountsUsecase = {
  getAccount: (id: number) => Promise<AccountEntity | undefined>;
  getAllAccounts: (userId: number) => Promise<AccountEntity[]>;
};

const GetAccountsUsecaseImpl = ({
  accountsDatasource,
  investmentAssetsDatasource,
  instrumentPriceDatasource,
  currencyDepositsDatasource,
}: Params): GetAccountsUsecase => {
  const getItems = (accountId: number): Promise<InvestmentAssetEntity[]> => {
    return investmentAssetsDatasource
      .getAllByAccountIdAndLotsGreaterZero(accountId)
      .then((items) => {
        return Promise.all(
          items.map((v) => {
            return instrumentPriceDatasource
              .get(v.instrumentFigi)
              .then((price) => convertToInvestmentAssetEntity(v, price));
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
    getAccount: (id: number) => {
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
    getAllAccounts: (userId: number) => {
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

export default GetAccountsUsecaseImpl;

