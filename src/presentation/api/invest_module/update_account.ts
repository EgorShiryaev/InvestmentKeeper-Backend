import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import checkChangesIsCorrect from '../../../core/utils/check_changes_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import StatusCode from '../../../domain/entities/status_code';
import UpdateAccountRequestData from '../../types/request_data/update_account_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../api';

type Params = {
  accountsDatasource: AccountsDatasource;
};

const UpdateAccount = ({ accountsDatasource }: Params): ApiMethod => {
  const requiredParams = ['id', 'title'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: UpdateAccountRequestData = request.body;
        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const record = await accountsDatasource.getById(params.id);
        if (!record) {
          throw NotFoundException('Account not found');
        }
        const changes = await accountsDatasource.update(params);
        if (!checkChangesIsCorrect(changes)) {
          throw ServerErrorException('Failed account update');
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

export default UpdateAccount;

