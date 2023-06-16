import NotFoundException from '../../core/exception/not_found_exception';
import ServerErrorException from '../../core/exception/server_error_exception';
import checkIdIsCorrect from '../../core/utils/required_params/check_id_is_correct';
import AccountsDatasource from '../../data/datasources/accounts_datasource/accounts_datasource';
import CurrenciesDatasource from '../../data/datasources/currencies_datasource/currencies_datasource';
import CurrencyDepositsDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import FinancialOperationsDatasource from '../../data/datasources/financial_operations_datasource/financial_operations_datasource';
import AccountModel from '../../data/models/account_model';
import CurrencyDepositModel from '../../data/models/currency_deposit_model';
import CurrencyModel from '../../data/models/currency_model';

type Params = {
  financialOperationsDatasource: FinancialOperationsDatasource;
  accountsDatasource: AccountsDatasource;
  currenciesDatasource: CurrenciesDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
};

type GetCurrencyDeposit = {
  account: AccountModel;
  currency: CurrencyModel;
};

type CallMethodParams = {
  accountId: number;
  value: number;
  currencyName: string;
  date?: string;
};

export type CreateRefillUsecase = {
  call: (params: CallMethodParams) => Promise<void>;
};

const CreateRefillUsecaseImpl = ({
  financialOperationsDatasource,
  accountsDatasource,
  currenciesDatasource,
  currencyDepositsDatasource,
}: Params): CreateRefillUsecase => {
  const getCurrencyDeposit = async ({
    account,
    currency,
  }: GetCurrencyDeposit): Promise<CurrencyDepositModel> => {
    const currencyDeposit =
      await currencyDepositsDatasource.getByAccountIdAndCurrencyId({
        accountId: account.id,
        currencyId: currency.id,
      });
    if (currencyDeposit) {
      return currencyDeposit;
    }
    await currencyDepositsDatasource.create({
      accountId: account.id,
      currencyId: currency.id,
    });
    return getCurrencyDeposit({ account: account, currency: currency });
  };

  return {
    call: async ({ accountId, value, currencyName, date }) => {
      const account = await accountsDatasource.getById(accountId);
      if (!account) {
        throw NotFoundException('Account not found');
      }
      const currency = await currenciesDatasource.get({
        value: currencyName,
      });
      if (!currency) {
        throw NotFoundException('Currency not found');
      }
      const id = await financialOperationsDatasource.create({
        accountId: accountId,
        currencyId: currency.id,
        value: value,
        date: date,
      });
      if (!checkIdIsCorrect(id)) {
        throw ServerErrorException('Failed refill creation');
      }
      const currencyDeposit = await getCurrencyDeposit({
        account: account,
        currency: currency,
      });
      const newBalance = currencyDeposit.value + value;
      try {
        await currencyDepositsDatasource.update({
          id: currencyDeposit.id,
          value: newBalance,
        });
      } catch {
        throw ServerErrorException('Failed currency deposit update');
      }
    },
  };
};

export default CreateRefillUsecaseImpl;

