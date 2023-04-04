import { getUserFromAuthTokenUserRepository } from '../../../core/utils/auth_token/auth_token_user_repository';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../../core/utils/required_params/generate_required_params_error';
import UserInvestmentAccountsRepository from '../../../domain/repositories/investment_accounts_repository/user_investment_accounts_repository';
import StatusCode from '../../../domain/entities/api/status_code';
import Api from '../api';
import UpdateInvestmentAccountData from '../../../domain/entities/api/investment_account/update_investment_account_data';
import ExceptionType from '../../../core/exceptions/exception_type';
import { IException } from '../../../core/exceptions/exception';

type Params = {
  repository: UserInvestmentAccountsRepository;
};

const UpdateUserInvestmentAccountApi = ({ repository }: Params): Api => {
  const requiredParams = ['id'];

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
      const updateInstrumentAccountData: UpdateInvestmentAccountData =
        request.body;

      if (!checkRequiredParams(updateInstrumentAccountData, requiredParams)) {
        const error = generateRequiredParamsError(
          updateInstrumentAccountData,
          requiredParams,
        );
        response.status(StatusCode.badRequest).json({ error: error });
        return;
      }

      const optionalParams = [
        updateInstrumentAccountData.title,
        updateInstrumentAccountData.visibility !== undefined,
      ];

      if (!optionalParams.reduce((prev, current) => prev || current, false)) {
        const optionalParamsTitle = ['title', 'visibility'];
        const fields = optionalParamsTitle.map((v) => `"${v}"`).join(', ');
        const error = `${fields} are optional parameters, but one of them must be specified`;
        response.status(StatusCode.badRequest).json({ error: error });
        return;
      }

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

