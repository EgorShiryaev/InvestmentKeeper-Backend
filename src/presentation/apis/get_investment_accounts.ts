import { getUserFromAuthTokenUserRepository } from '../../core/utils/bearer_token/auth_token_user_repository';
import getAuthToken from '../../core/utils/bearer_token/get_auth_token';
import UserInvestmentAccountsRepository from '../../domain/repositories/user_investment_accounts_repository/user_investment_accounts_repository';
import StatusCode from '../status_codes/status_code';
import Api from './api';

type Params = {
  repository: UserInvestmentAccountsRepository;
};

const GetInvestmentAccountsApi = ({ repository }: Params): Api => {
  return {
    handler: async (request, response) => {
      console.log(request.method, request.url);

      const authToken = getAuthToken(request.headers);
      if (!authToken) {
        response.sendStatus(StatusCode.forbidden);
        return;
      }

      const user = getUserFromAuthTokenUserRepository(authToken);
      if (!user) {
        response.sendStatus(StatusCode.forbidden);
        return;
      }

      try {
        const records = await repository.getAll(user.id);
        response.status(StatusCode.success).json({ accounts: records });
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default GetInvestmentAccountsApi;

