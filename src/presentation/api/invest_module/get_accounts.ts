import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import convertToAccountEntity from '../../../core/utils/convectors/convert_to_account_entity';
import convertToAccountItemEntity from '../../../core/utils/convectors/convert_to_account_item_entity';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountItemsDatasource from '../../../data/datasources/account_items_datasource/account_items_datasource';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import AccountEntity from '../../../domain/entities/account_entity';
import AccountItemEntity from '../../../domain/entities/account_item_entity';
import StatusCode from '../../../domain/entities/status_code';
import ErrorResponseData from '../../types/response_data/error_response_data';
import GetAccountsResponseData from '../../types/response_data/get_accounts_response_data';
import ApiMethod from '../../types/methods/api_method';
import InstrumentPriceDatasource from '../../../data/datasources/instrument_price_datasource/instrument_price_datasource';
import GetAccountRequestData from '../../types/request_data/get_account_request_data';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';
import GetAccountResponseData from '../../types/response_data/get_account_response_data';

type Params = {
  accountsDatasource: AccountsDatasource;
  accountItemsDatasource: AccountItemsDatasource;
  instrumentPriceDatasource: InstrumentPriceDatasource;
};

const GetAccounts = ({
  accountsDatasource,
  accountItemsDatasource,
  instrumentPriceDatasource,
}: Params): ApiMethod => {
  const getItems = (accountId: number): Promise<AccountItemEntity[]> => {
    return accountItemsDatasource
      .getAllByAccountIdAndLotsGreaterZero(accountId)
      .then((items) => {
        return Promise.all(
          items.map(async (v) => {
            const price = await instrumentPriceDatasource.get(v.instrumentFigi);
            return convertToAccountItemEntity(v, price);
          }),
        );
      });
  };

  const getUserAccounts = (userId: number): Promise<AccountEntity[]> => {
    return accountsDatasource.getAllByUserId(userId).then((accounts) => {
      return Promise.all(
        accounts.map((account) => {
          return getItems(account.id).then((items) => {
            return convertToAccountEntity(account, items);
          });
        }),
      );
    });
  };

  const getAccount = (id: number): Promise<AccountEntity | null> => {
    return accountsDatasource.getById(id).then((account) => {
      if (!account) {
        return null;
      }
      return getItems(account.id).then((items) => {
        return convertToAccountEntity(account, items);
      });
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

