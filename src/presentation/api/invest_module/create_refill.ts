import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import CreateRefillRequestData from '../../types/request_data/create_refill_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIsIsoDateFormat from '../../../core/utils/required_params/check_is_iso_date_format';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { CreateRefillUsecase } from '../../../domain/usecases/create_refill_usecase';
import ExceptionId from '../../../core/exception/exception_id';

type Params = {
  createRefillUsecase: CreateRefillUsecase;
};

const CreateRefill = ({ createRefillUsecase }: Params): ApiMethod => {
  const requiredParams = ['accountId', 'value', 'currency'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateRefillRequestData = request.body;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (
          params.date !== null &&
          params.date !== undefined &&
          !checkIsIsoDateFormat(params.date)
        ) {
          throw BadRequestException({
            id: ExceptionId.invalidDateDormat,
            message: 'date should be is string to iso date format',
          });
        }
        getAuthedUser(request.headers);
        await createRefillUsecase.call({
          accountId: params.accountId,
          value: params.value,
          currencyName: params.currency,
          date: params.date,
        });
        response.sendStatus(StatusCode.created);
      } catch (error) {
        const exception = error as IException;
        const statusCode = getStatusCodeByExceptionCode(exception.code);
        const errorResponseData: ErrorResponseData = {
          id: exception.id,
          message: exception.message,
        };
        response.status(statusCode).json(errorResponseData);
      }
    },
  };
};

export default CreateRefill;

