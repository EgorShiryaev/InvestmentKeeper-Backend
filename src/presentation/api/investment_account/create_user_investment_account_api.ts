import { getUserFromAuthTokenUserRepository } from '../../../core/utils/auth_token/auth_token_user_repository';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../../core/utils/required_params/generate_required_params_error';
import InvestmentAccountType from '../../../domain/entities/investment_account/investment_account_type';
import UserInvestmentAccountsRepository from '../../../domain/repositories/investment_accounts_repository/user_investment_accounts_repository';
import StatusCode from '../../../domain/entities/api/status_code';
import Api from '../api';
import CreateInvestmentAccountData from '../../../domain/entities/api/investment_account/create_investment_account_data';

type Params = {
  repository: UserInvestmentAccountsRepository;
};

const CreateUserInvestmentAccountApi = ({ repository }: Params): Api => {
  const requiredParams = ['title', 'type'];

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
      const createInstrumentAccountData: CreateInvestmentAccountData =
        request.body;

      try {
        if (createInstrumentAccountData.type === InvestmentAccountType.IIA) {
          const iiaIsAlreadyExists = !!(await repository.getAll(user.id)).find(
            (item) => item.type === InvestmentAccountType.IIA,
          );
          if (iiaIsAlreadyExists) {
            response.status(StatusCode.badRequest).json({
              status: 'Individual Investment Account is already exist',
            });
            return;
          }
        }

        await repository.create({
          userId: user.id,
          ...createInstrumentAccountData,
        });
        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default CreateUserInvestmentAccountApi;

