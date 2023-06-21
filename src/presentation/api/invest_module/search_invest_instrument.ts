import { IException } from '../../../core/exception/exception';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import SearchInvestInstrumentRequestData from '../../types/request_data/search_invest_instrument_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import SearchInvestInstrumentResponseData from '../../types/response_data/search_invest_instrument_response_data';
import ApiMethod from '../../types/methods/api_method';
import getAuthedUser from '../../../core/utils/get_auth_user';
import { SearchInvestInstrumentUsecase } from '../../../domain/usecases/search_invest_instrument_usecase';

type Params = {
  searchInvestInstrumentUsecase: SearchInvestInstrumentUsecase;
};

const SearchInvestInstrument = ({
  searchInvestInstrumentUsecase,
}: Params): ApiMethod => {
  const requiredParams = ['query'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as SearchInvestInstrumentRequestData;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        getAuthedUser(request.headers);
        const instruments = await  searchInvestInstrumentUsecase.call({
          query: params.query,
        });
        const responseData: SearchInvestInstrumentResponseData = {
          instruments: instruments,
        };
        response.status(StatusCode.success).json(responseData);
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

export default SearchInvestInstrument;

