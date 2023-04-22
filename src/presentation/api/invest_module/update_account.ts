import UpdateException from '../../../core/exceptions/update_exception';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import generateRequiredParamsError from '../../../core/utils/required_params/generate_required_params_error';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import UpdateAccountRequestData from '../../types/request_data/update_account_request_data';
import ApiMethod from '../api';

type Params = {
  datasource: AccountsDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const UpdateAccount = ({
  datasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['id', 'title'];

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
        const updateAccountRequestData: UpdateAccountRequestData = request.body;

        if (!checkRequiredParams(updateAccountRequestData, requiredParams)) {
          const error = generateRequiredParamsError(
            updateAccountRequestData,
            requiredParams,
          );
          response.status(StatusCode.badRequest).json({ error: error });
          return;
        }

        const record = datasource.getById(
          updateAccountRequestData.id,
        );

        if (!record) {
          response.sendStatus(StatusCode.notFound);
          return;
        }

        const changes = await datasource.update(updateAccountRequestData);
        if (!changes && changes !== 0) {
          response.status(StatusCode.serverError).json(UpdateException());
          return;
        }
        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default UpdateAccount;

