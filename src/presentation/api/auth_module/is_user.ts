import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import UsersDatasource from '../../../data/datasources/users_datasource/users_datasource';
import StatusCode from '../../../domain/entities/status_code';
import ApiMethod from '../../types/methods/api_method';
import IsUserRequestData from '../../types/request_data/is_user_request_data';
import { IException } from '../../../core/exception/exception';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import BadRequestException from '../../../core/exception/bad_request_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ErrorResponseData from '../../types/response_data/error_response_data';
import checkPhoneNumberIsCorrectFormat from '../../../core/utils/required_params/check_phone_number_format';

type Params = {
  usersDatasource: UsersDatasource;
};

const IsUser = ({ usersDatasource }: Params): ApiMethod => {
  const requiredParams = ['phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as IsUserRequestData;
        const checkResult = checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        if (!checkPhoneNumberIsCorrectFormat(params.phoneNumber)) {
          throw BadRequestException(
            'Parameter phoneNumber should be a format string +7(123)-456-78-90',
          );
        }
        const user = await usersDatasource.getByPhoneNumber(params.phoneNumber);
        if (!user) {
          throw NotFoundException('User not found');
        }
        response.sendStatus(StatusCode.noContent);
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

export default IsUser;

