import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import CreatePurchaseRequestData from '../../types/request_data/create_purchase_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIsIsoDateFormat from '../../../core/utils/required_params/check_is_iso_date_format';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { CreatePurchaseUsecase } from '../../../domain/usecases/create_purchase_usecase';
import checkNotNullableValue from '../../../core/utils/check_not_nullable_value';
import convertToNumber from '../../../core/utils/convectors/convert_to_number';

type Params = {
  createPurchaseUsecase: CreatePurchaseUsecase;
};

const CreatePurchase = ({ createPurchaseUsecase }: Params): ApiMethod => {
  const requiredParams = [
    'accountId',
    'instrumentId',
    'lots',
    'price',
    'withdrawFundsFromBalance',
  ];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreatePurchaseRequestData = request.body;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (
          checkNotNullableValue(params.date) &&
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          !checkIsIsoDateFormat(params.date!)
        ) {
          throw BadRequestException(
            'date should be is string to iso date format',
          );
        }
        getAuthedUser(request.headers);
        await createPurchaseUsecase.call({
          accountId: params.accountId,
          instrumentId: params.instrumentId,
          lots: params.lots,
          price: params.price,
          date: params.date,
          commission: params.commission,
          withdrawFundsFromBalance: params.withdrawFundsFromBalance,
        });
        response.sendStatus(StatusCode.created);
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

export default CreatePurchase;

