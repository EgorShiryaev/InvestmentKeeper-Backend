import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import convertToInvestInstrumentEntity from '../../../core/utils/convectors/convert_to_invest_instrument_entity';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
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

        const authToken = getAuthToken(request.headers);
        if (!authToken) {
          response.sendStatus(StatusCode.forbidden);
          return;
        }

        const params: SearchInvestInstrumentRequestData =
          request.query as SearchInvestInstrumentRequestData;

        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          const responseData: ErrorResponseData = {
            error: checkResult.message,
          };
          response.status(StatusCode.badRequest).json(responseData);
          return;
        }

        const user = authentificatedUsersRepository.get(authToken);
        if (!user) {
          response.sendStatus(StatusCode.forbidden);
          return;
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
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default SearchInvestInstrument;

