import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import convertToInvestInstrumentEntity from '../../../core/utils/convectors/convert_to_invest_instrument_entity';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import StatusCode from '../../../domain/entities/status_code';
import SearchInvestInstrumentRequestData from '../../types/request_data/search_invest_instrument_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import SearchInvestInstrumentResponseData from '../../types/response_data/search_invest_instrument_response_data';
import ApiMethod from '../api';

type Params = {
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

const SearchInvestInstrument = ({
  investInstrumentsDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['query'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as SearchInvestInstrumentRequestData;
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
        const trimmedQuery = params.query.trim();
        const instrumentsFullData =
          await investInstrumentsDatasource.getAllLikeTitleOrTickerOrFigi(
            trimmedQuery,
          );
        const instruments = instrumentsFullData.map((instrument) =>
          convertToInvestInstrumentEntity(instrument),
        );
        const responseData: SearchInvestInstrumentResponseData = {
          instruments: instruments,
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

export default SearchInvestInstrument;

