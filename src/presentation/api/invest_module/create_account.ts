import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkIdIsCorrect from '../../../core/utils/check_id_is_correct';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import CreateAccountRequestData from '../../types/request_data/create_accounts_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
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
        const params: CreateAccountRequestData = request.body;
        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        const authToken = getAuthToken(request.headers);
        if (!authToken) {
          throw ForbiddenException();
        }
        const user = authentificatedUsersRepository.get(authToken);
        if (!user) {
          throw ForbiddenException();
        }
        const id = await datasource.create({
          userId: user.id,
          ...params,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed account creation');
        }
        response.sendStatus(StatusCode.noContent);
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

export default CreateAccount;

