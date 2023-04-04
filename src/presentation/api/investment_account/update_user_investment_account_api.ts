import { getUserFromAuthTokenUserRepository } from '../../../core/utils/auth_token/auth_token_user_repository';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../../core/utils/required_params/generate_required_params_error';
import UserInvestmentAccountsRepository from '../../../domain/repositories/user_investment_accounts_repository/user_investment_accounts_repository';
import StatusCode from '../../../domain/entities/api/status_code';
import Api from '../api';
import UpdateInvestmentAccountData from '../../../domain/entities/api/investment_account/update_investment_account_data';
import ExceptionType from '../../../core/exceptions/exception_type';
import { IException } from '../../../core/exceptions/exception';

type Params = {
  repository: UserInvestmentAccountsRepository;
};

const UpdateUserInvestmentAccountApi = ({ repository }: Params): Api => {
  const requiredParams = ['title'];

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

      if (!checkRequiredParams(request.body, requiredParams)) {
        const error = generateRequiredParamsError(request.body, requiredParams);
        response.status(StatusCode.badRequest).json({ error: error });
        return;
      }

      const updateInstrumentAccountData: UpdateInvestmentAccountData =
        request.body;

      try {
        await repository.update(updateInstrumentAccountData);
        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        const exception = error as IException;
        if (exception?.type === ExceptionType.notFoundException) {
          response.status(StatusCode.notFound).json(exception);
          return;
        }
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default UpdateUserInvestmentAccountApi;

