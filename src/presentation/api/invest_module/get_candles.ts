import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import convertToCandleEntity from '../../../core/utils/convectors/convert_to_candle_entity';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkCandleTimesizeIsCorrectValue from '../../../core/utils/required_params/check_candle_timesize_is_correct_value';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import checkStringIsValidDate from '../../../core/utils/required_params/check_string_is_date';
import getCandleTimesizeValues from '../../../core/utils/required_params/get_candle_timesize_values';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import CandlesDatasource from '../../../data/datasources/candles_datasource/candles_datasource';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import StatusCode from '../../../domain/entities/status_code';
import GetCandlesRequestData from '../../types/request_data/get_candles_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import GetCandlesResponseData from '../../types/response_data/get_candles_response_data';
import ApiMethod from '../../types/methods/api_method';
import convertToCandleTimesizeModel from '../../../core/utils/convectors/convert_to_candle_timesize_model';

type Params = {
  investInstrumentsDatasource: InvestInstrumentsDatasource;
  candlesDatasource: CandlesDatasource;
};

const GetCandles = ({
  investInstrumentsDatasource,
  candlesDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['instrumentId', 'from', 'to', 'candleTimesize'];

  const getCandles = async (data: GetCandlesRequestData, figi: string) => {
    return candlesDatasource
      .get({
        from: new Date(data.from),
        to: new Date(data.to),
        figi: figi,
        candleTimesize: convertToCandleTimesizeModel(data.candleTimesize),
      })
      .then((values) => {
        return values.map((v) => convertToCandleEntity(v));
      });
  };

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as unknown as GetCandlesRequestData;
        const checkResult = checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        if (!checkStringIsValidDate(params.from)) {
          throw BadRequestException('from parameter value must be valid date');
        }
        if (!checkStringIsValidDate(params.to)) {
          throw BadRequestException('to parameter value must be valid date');
        }
        if (!checkCandleTimesizeIsCorrectValue(params.candleTimesize)) {
          const values = getCandleTimesizeValues().join(', ');
          throw BadRequestException(
            `candleTimesize parameter value must be one of [${values}]`,
          );
        }
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const instrument = await investInstrumentsDatasource.getById(
          params.instrumentId,
        );
        if (!instrument) {
          throw NotFoundException('Invest instrument not found');
        }
        const candles = await getCandles(params, instrument.figi);
        const responseData: GetCandlesResponseData = {
          candles: candles,
        };
        response.status(StatusCode.success).json(responseData);
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

export default GetCandles;

