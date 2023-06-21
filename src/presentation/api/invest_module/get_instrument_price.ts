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
import getCodeAndResponseDataByException from '../../../core/utils/response_utils/send_error_reponse_by_exception';
import GetInstrumentPriceRequestData from '../../types/request_data/get_instrument_price_request_data';
import { GetInstrumentPriceUsecase } from '../../../domain/usecases/get_instrument_price_usecase';
import GetInstrumentPriceResponseData from '../../types/response_data/get_instrument_price_response_data';

type Params = {
  getInstrumentPriceUsecase: GetInstrumentPriceUsecase;
};

const GetInstrumentPrice = ({ getInstrumentPriceUsecase }: Params): ApiMethod => {
  const requiredParams = ['instrumentId'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params =
          request.query as unknown as GetInstrumentPriceRequestData;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        getAuthedUser(request.headers);
        const price = await getInstrumentPriceUsecase.call(params.instrumentId);
        const requestData: GetInstrumentPriceResponseData = {
          price: price,
        };
        response.status(StatusCode.success).json(requestData);
      } catch (error) {
        const { statusCode, responseData } = getCodeAndResponseDataByException(
          error as IException,
        );
        response.status(statusCode).json(responseData);
      }
    },
  };
};

export default GetInstrumentPrice;

