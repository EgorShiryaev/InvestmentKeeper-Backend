import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import StatusCode from '../../../domain/entities/status_code';
import ApiMethod from '../../types/methods/api_method';
import IsUserRequestData from '../../types/request_data/is_user_request_data';
import { IException } from '../../../core/exception/exception';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import BadRequestException from '../../../core/exception/bad_request_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ErrorResponseData from '../../types/response_data/error_response_data';
import checkPhoneNumberIsCorrectFormat from '../../../core/utils/required_params/check_phone_number_format';
import { IsUserUsecase } from '../../../domain/usecases/is_user_usecase';
import ExceptionId from '../../../core/exception/exception_id';
import getCodeAndResponseDataByException from '../../../core/utils/response_utils/send_error_reponse_by_exception';

type Params = {
  isUserUsecase: IsUserUsecase;
};

const IsUser = ({ isUserUsecase }: Params): ApiMethod => {
  const requiredParams = ['phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as IsUserRequestData;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        if (!checkPhoneNumberIsCorrectFormat(params.phoneNumber)) {
          throw BadRequestException({
            id: ExceptionId.invalidPhoneFormat,
            message:
              'Parameter phoneNumber should be a format string +7(123)-456-78-90',
          });
        }
        const isExists = await isUserUsecase.call(params.phoneNumber);
        if (!isExists) {
          throw NotFoundException({
            id: ExceptionId.userNotFound,
            message: 'User not found',
          });
        }
        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        const { statusCode, responseData } = getCodeAndResponseDataByException(
          error as IException,
        );
        response.status(statusCode).json(responseData);
      }
    },
  };
};

export default IsUser;

