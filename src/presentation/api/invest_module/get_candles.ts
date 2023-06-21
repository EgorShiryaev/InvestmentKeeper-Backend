import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import checkCandleTimesizeIsCorrectValue from '../../../core/utils/required_params/check_candle_timesize_is_correct_value';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import checkIsIsoDateFormat from '../../../core/utils/required_params/check_is_iso_date_format';
import getCandleTimesizeValues from '../../../core/utils/required_params/get_candle_timesize_values';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import GetCandlesRequestData from '../../types/request_data/get_candles_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { GetCandlesUsecase } from '../../../domain/usecases/get_candles_usecase';
import GetCandlesResponseData from '../../types/response_data/get_candles_response_data';
import ExceptionId from '../../../core/exception/exception_id';

type Params = {
  getCandlesUsecase: GetCandlesUsecase;
};

const GetCandles = ({ getCandlesUsecase }: Params): ApiMethod => {
  const requiredParams = ['instrumentId', 'from', 'to', 'candleTimesize'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as unknown as GetCandlesRequestData;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkIsIsoDateFormat(params.from)) {
          throw BadRequestException({
            id: ExceptionId.invalidDateDormat,
            message: 'from parameter value must be valid date',
          });
        }
        if (!checkIsIsoDateFormat(params.to)) {
          throw BadRequestException({
            id: ExceptionId.invalidDateDormat,
            message: 'to parameter value must be valid date',
          });
        }
        if (!checkCandleTimesizeIsCorrectValue(params.candleTimesize)) {
          const values = getCandleTimesizeValues().join(', ');
          throw BadRequestException({
            id: ExceptionId.invalidCandleTimesize,
            message: `candleTimesize parameter value must be one of [${values}]`,
          });
        }
        getAuthedUser(request.headers);
        const candles = await getCandlesUsecase.call({
          from: params.from,
          to: params.to,
          candleTimesize: params.candleTimesize,
          instrumentId: params.instrumentId,
        });
        const requestData: GetCandlesResponseData = {
          candles: candles,
        };
        response.status(StatusCode.success).json(requestData);
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

export default GetCandles;

