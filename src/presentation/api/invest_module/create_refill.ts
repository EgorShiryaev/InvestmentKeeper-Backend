import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import checkChangesIsCorrect from '../../../core/utils/required_params/check_changes_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import AccountsDatasource from '../../../data/datasources/accounts_datasource/accounts_datasource';
import RefillsDatasource from '../../../data/datasources/refills_datasource/refills_datasource';
import StatusCode from '../../../domain/entities/status_code';
import CreateRefillRequestData from '../../types/request_data/create_refill_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIdIsCorrect from '../../../core/utils/required_params/check_id_is_correct';

type Params = {
  refillsDatasource: RefillsDatasource;
  accountsDatasource: AccountsDatasource;
};

const CreateRefill = ({
  refillsDatasource: refillDatasource,
  accountsDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['accountId', 'value'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateRefillRequestData = request.body;
        const checkResult = checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const account = await accountsDatasource.getById(params.accountId);
        if (!account) {
          throw NotFoundException('Account not found');
        }
        const id = await refillDatasource.create({
          accountId: params.accountId,
          value: params.value,
        });
        if (!checkIdIsCorrect(id)) {
          throw ServerErrorException('Failed refill creation');
        }
        const newBalance = account.balance + params.value;
        const accountsChanges = await accountsDatasource.update({
          id: account.id,
          balance: newBalance,
        });
        if (!checkChangesIsCorrect(accountsChanges)) {
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

export default CreateRefill;

