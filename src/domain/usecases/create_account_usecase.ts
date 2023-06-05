import NotFoundException from '../../core/exception/not_found_exception';
import ServerErrorException from '../../core/exception/server_error_exception';
import checkIdIsCorrect from '../../core/utils/required_params/check_id_is_correct';
import AccountsDatasource from '../../data/datasources/accounts_datasource/accounts_datasource';
import CurrenciesDatasource from '../../data/datasources/currencies_datasource/currencies_datasource';
import CurrencyDepositsDatasource from '../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import UserModel from '../../data/models/user_model';

type Params = {
  accountsDatasource: AccountsDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
  currenciesDatasource: CurrenciesDatasource;
};

type CallMethodParams = {
  user: UserModel;
  title: string;
  currency: string;
};

export type CreateAccountUsecase = {
  call: (params: CallMethodParams) => Promise<void>;
};

const CreateAccountUsecaseImpl = ({
  accountsDatasource,
  currencyDepositsDatasource,
  currenciesDatasource,
}: Params): CreateAccountUsecase => {
  return {
    call: async ({ title, currency: currencyName, user }) => {
      const currency = await currenciesDatasource.get({
        value: currencyName,
      });
      if (!currency) {
        throw NotFoundException('Currency not found');
      }
      const id = await accountsDatasource.create({
        userId: user.id,
        title: title,
      });
      if (!checkIdIsCorrect(id)) {
        throw ServerErrorException('Failed account creation');
      }
      const currencyDepositsId = await currencyDepositsDatasource.create({
        currencyId: currency.id,
        accountId: id,
      });
      if (!checkIdIsCorrect(currencyDepositsId)) {
        throw ServerErrorException('Failed currency deposit creation');
      }
    },
  };
};

export default CreateAccountUsecaseImpl;

