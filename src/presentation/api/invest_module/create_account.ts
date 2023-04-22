import CreateException from '../../../core/exceptions/create_exception';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../../core/utils/required_params/generate_required_params_error';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import CreateAccountRequestData from '../../types/request_data/create_accounts_request_data';
import ApiMethod from '../api';

type Params = {
  datasource: AccountsDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const CreateAccount = ({
  datasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['title'];

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

        if (!checkRequiredParams(request.body, requiredParams)) {
          const error = generateRequiredParamsError(
            request.body,
            requiredParams,
          );
          response.status(StatusCode.badRequest).json({ error: error });
          return;
        }
        const createAccountRequestData: CreateAccountRequestData = request.body;

        const id = await datasource.create({
          userId: user.id,
          ...createAccountRequestData,
        });

        if (!id && id !== 0) {
          response.status(StatusCode.serverError).json(CreateException());
          return;
        }
        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default CreateAccount;

