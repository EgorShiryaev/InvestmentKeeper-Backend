import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import convertToAccountEntity from '../../../core/utils/convectors/convert_to_account_entity';
import convertToAccountItemEntity from '../../../core/utils/convectors/convert_to_account_item_entity';
import AccountItemsDatasource from '../../../data/datasources/account_items_datasource/account_items_datasource';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import AccountEntity from '../../../domain/entities/account_entity';
import AccountItemEntity from '../../../domain/entities/account_item_entity';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import GetAccountsResponseData from '../../types/response_data/get_accounts_response_data';
import ApiMethod from '../api';

type Params = {
  accountsDatasource: AccountsDatasource;
  accountItemsDatasource: AccountItemsDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const GetAccounts = ({
  accountsDatasource,
  accountItemsDatasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const getItems = (accountId: number): Promise<AccountItemEntity[]> => {
    return accountItemsDatasource.getAllByAccountId(accountId).then((items) => {
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

        const authToken = getAuthToken(request.headers);
        if (!authToken) {
          response.sendStatus(StatusCode.forbidden);
          return;
        }

        const user = authentificatedUsersRepository.get(authToken);
        if (!user) {
          response.sendStatus(StatusCode.forbidden);
          return;
        }

        const accounts = await getAccounts(user.id);
        const responseData: GetAccountsResponseData = {
          accounts: accounts,
        };
        response.status(StatusCode.success).json(responseData);
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default GetAccounts;

