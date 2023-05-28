import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import convertToAccountEntity from '../../../core/utils/convectors/convert_to_account_entity';
import convertToInvestmentAssetEntity from '../../../core/utils/convectors/convert_to_account_item_entity';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import InvestmentAssetsDatasource from '../../../data/datasources/investment_assets_datasource/investment_assets_datasource';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import AccountEntity from '../../../domain/entities/account_entity';
import InvestmentAssetEntity from '../../../domain/entities/investment_asset_entity';
import StatusCode from '../../../domain/entities/status_code';
import ErrorResponseData from '../../types/response_data/error_response_data';
import GetAccountsResponseData from '../../types/response_data/get_accounts_response_data';
import ApiMethod from '../../types/methods/api_method';
import InstrumentPriceDatasource from '../../../data/datasources/instrument_price_datasource/instrument_price_datasource';
import GetAccountRequestData from '../../types/request_data/get_account_request_data';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import GetAccountResponseData from '../../types/response_data/get_account_response_data';
import CurrencyDepositEntity from '../../../domain/entities/currency_deposit_entity';
import CurrencyDepositsDatasource from '../../../data/datasources/currency_deposits_datasource/currency_deposits_datasource';
import convertToCurrencyDepositEntity from '../../../core/utils/convectors/convert_to_currency_deposit_entity';

type Params = {
  accountsDatasource: AccountsDatasource;
  investmentAssetsDatasource: InvestmentAssetsDatasource;
  instrumentPriceDatasource: InstrumentPriceDatasource;
  currencyDepositsDatasource: CurrencyDepositsDatasource;
};

const GetAccounts = ({
  accountsDatasource,
  investmentAssetsDatasource,
  instrumentPriceDatasource,
  currencyDepositsDatasource,
}: Params): ApiMethod => {
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

  const getUserAccounts = (userId: number): Promise<AccountEntity[]> => {
    return accountsDatasource.getAllByUserId(userId).then((accounts) => {
      return Promise.all(
        accounts.map(async (account) => {
          const items = await getItems(account.id);
          const currencyDeposits = await getCurrencyDeposits(account.id);
          return convertToAccountEntity(account, items, currencyDeposits);
        }),
      );
    });
  };

  const getAccount = (id: number): Promise<AccountEntity | undefined> => {
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
  };

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const params = request.query as unknown as GetAccountRequestData;
        if (!checkIdIsCorrect(params.id)) {
          const accounts = await getUserAccounts(user.id);
          const responseData: GetAccountsResponseData = {
            accounts: accounts,
          };
          response.status(StatusCode.success).json(responseData);
          return;
        }
        const acccount = await getAccount(params.id);
        if (!acccount) {
          response.sendStatus(StatusCode.notFound);
          return;
        }
        const responseData: GetAccountResponseData = acccount;
        response.status(StatusCode.success).json(responseData);
      } catch (error) {
        const exception = error as IException;
        const statusCode = getStatusCodeByExceptionCode(exception.code);
        const errorResponseData: ErrorResponseData = {
          message: exception.message,
        };
        response.status(statusCode).json(errorResponseData);
      }
    },
  };
};

export default GetAccounts;

