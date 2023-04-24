import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import WithdrawalsDatasource from '../../../data/datasources/withdrawals_datasource/withdrawals_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import CreateRefillRequestData from '../../types/request_data/create_refill_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../api';

type Params = {
  withdrawalsDatasource: WithdrawalsDatasource;
  accountsDatasource: AccountsDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const CreateWithdrawal = ({
  withdrawalsDatasource,
  accountsDatasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['accountId', 'value'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateRefillRequestData = request.body;
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
        const account = await accountsDatasource.getById(params.accountId);
        if (!account) {
          throw NotFoundException('Account not found');
        }
        if (params.value > account.balance) {
          throw BadRequestException(
            'You can`t withdraw this amount because there are not enough funds on your account',
          );
        }
        const id = await withdrawalsDatasource.create({
          accountId: params.accountId,
          value: params.value,
        });
        if (!id && id !== 0) {
          throw ServerErrorException('Failed refill creation');
        }
        const newBalance = account.balance - params.value;
        const accountsChanges = await accountsDatasource.update({
          id: account.id,
          balance: newBalance,
        });
        if (!accountsChanges) {
          throw ServerErrorException('Failed account item update');
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

export default CreateWithdrawal;

