import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import convertToInvestInstrumentEntity from '../../../core/utils/convectors/convert_to_invest_instrument_entity';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import SearchInvestInstrumentRequestData from '../../types/request_data/search_invest_instrument_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import SearchInvestInstrumentResponseData from '../../types/response_data/search_invest_instrument_response_data';
import ApiMethod from '../api';

type Params = {
  datasource: InvestInstrumentsDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const SearchInvestInstrument = ({
  datasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['query'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as SearchInvestInstrumentRequestData;
        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        const authToken = getAuthToken(request.headers);
        if (!authToken) {
          throw ForbiddenException();
        }
        const user = authentificatedUsersRepository.get(authToken);
        if (!user) {
          throw ForbiddenException();
        }
        const trimmedQuery = params.query.trim();
        const instrumentsFullData =
          await datasource.getAllLikeTitleOrTickerOrFigi(trimmedQuery);
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

