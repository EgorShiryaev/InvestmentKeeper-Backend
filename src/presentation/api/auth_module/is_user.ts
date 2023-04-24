import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import UsersDatasource from '../../../data/datasources/users_datasource/users_datasource';
import StatusCode from '../../../domain/entities/status_code';
import ApiMethod from '../api';
import ErrorResponseData from '../../types/response_data/error_response_data';
import IsUserRequestData from '../../types/request_data/is_user_request_data';

type Params = {
  datasource: UsersDatasource;
};

const IsUser = ({ datasource }: Params): ApiMethod => {
  const requiredParams = ['phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);

        const params = request.query as IsUserRequestData;

        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          const responseData: ErrorResponseData = {
            error: checkResult.message,
          };
          response.status(StatusCode.badRequest).json(responseData);
          return;
        }

        const user = await datasource.getByPhoneNumber(params.phoneNumber);
        if (!user) {
          response.sendStatus(StatusCode.notFound);
          return;
        }

        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default IsUser;

