import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import CreateSaleRequestData from '../../types/request_data/create_sale_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import checkIsIsoDateFormat from '../../../core/utils/required_params/check_is_iso_date_format';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { CreateSaleUsecase } from '../../../domain/usecases/create_sale_usecase';
import checkNotNullableValue from '../../../core/utils/check_not_nullable_value';
import ExceptionId from '../../../core/exception/exception_id';

type Params = {
  createSaleUsecase: CreateSaleUsecase;
};

const CreateSale = ({ createSaleUsecase }: Params): ApiMethod => {
  const requiredParams = [
    'accountId',
    'instrumentId',
    'lots',
    'price',
    'addFundsFromSaleToBalance',
  ];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: CreateSaleRequestData = request.body;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (
          checkNotNullableValue(params.date) &&
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          !checkIsIsoDateFormat(params.date!)
        ) {
          throw BadRequestException({
            id: ExceptionId.invalidDateDormat,
            message: 'date should be is string to iso date format',
          });
        }
        getAuthedUser(request.headers);
        await createSaleUsecase.call({
          accountId: params.accountId,
          instrumentId: params.instrumentId,
          lots: params.lots,
          price: params.price,
          date: params.date,
          commission: params.commission,
          addFundsFromSaleToBalance: params.addFundsFromSaleToBalance,
        }),
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

export default CreateSale;

