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

type Params = {
  accountsDatasource: AccountsDatasource;
  accountItemsDatasource: AccountItemsDatasource;
};

const GetAccounts = ({
  accountsDatasource,
  accountItemsDatasource,
}: Params): ApiMethod => {
  const getItems = (accountId: number): Promise<AccountItemEntity[]> => {
    return accountItemsDatasource
      .getAllByAccountIdAndLotsGreaterZero(accountId)
      .then((items) => {
        return items.map((v) => convertToAccountItemEntity(v));
      });
  };

  const getAccounts = (userId: number): Promise<AccountEntity[]> => {
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

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const accounts = await getAccounts(user.id);
        const responseData: GetAccountsResponseData = {
          accounts: accounts,
        };
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

